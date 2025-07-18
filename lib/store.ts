import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActivityData } from "./db/schema";

// Sitewide password unlock store
interface UnlockStore {
  unlocked: boolean;
  setUnlocked: (unlocked: boolean) => void;
  resetUnlock: () => void;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useUnlockStore = create<UnlockStore>()(
  persist(
    (set) => ({
      unlocked: false,
      hydrated: false,
      setUnlocked: (unlocked: boolean) => set({ unlocked }),
      resetUnlock: () => set({ unlocked: false }),
      setHydrated: (hydrated: boolean) => set({ hydrated }),
    }),
    {
      name: "unlock-store",
      partialize: (state: UnlockStore) => ({ unlocked: state.unlocked }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(true);
      },
    }
  )
);

interface ActivityStore {
  activities: ActivityData[];
  isLoaded: boolean;
  setActivities: (activities: ActivityData[]) => void;
  clearActivities: () => void;
  getAvailableCategories: () => string[];
  getTopActivities: (limit?: number) => ActivityData[];
  getCategoryStats: () => Array<{
    category: string;
    count: number;
    avgScore: number;
  }>;
  getTotalStats: () => {
    totalActivities: number;
    totalLoveVotes: number;
    totalLikeVotes: number;
    totalPassVotes: number;
    avgScore: number;
  };
  getBudgetAnalysis: () => Array<{
    priceRange: string;
    activities: ActivityData[];
    avgScore: number;
    count: number;
    bestValue: ActivityData | null;
  }>;
  getGroupDynamics: () => {
    consensus: ActivityData[];
    controversial: ActivityData[];
    polarizing: ActivityData[];
    unanimous: ActivityData[];
  };
  getVotingPatterns: () => {
    totalVotes: number;
    lovePercentage: number;
    likePercentage: number;
    passPercentage: number;
    engagementScore: number;
  };
  getScoreDistribution: () => Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  getCategoryLeaders: () => Array<{
    category: string;
    topActivity: ActivityData;
    avgScore: number;
    totalActivities: number;
  }>;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: [],
      isLoaded: false,

      setActivities: (activities) => {
        set({ activities, isLoaded: true });
      },

      clearActivities: () => {
        set({ activities: [], isLoaded: false });
      },

      getAvailableCategories: () => {
        const { activities } = get();
        const categories = Array.from(
          new Set(activities.map((a) => a.category).filter(Boolean))
        );
        return categories.sort();
      },

      getTopActivities: (limit = 10) => {
        const { activities } = get();
        return [...activities]
          .sort((a, b) => (b.score || 0) - (a.score || 0))
          .slice(0, limit);
      },

      getCategoryStats: () => {
        const { activities } = get();
        const categories = activities.reduce((acc, activity) => {
          const category = activity.category || "Other";
          if (!acc[category]) {
            acc[category] = { count: 0, totalScore: 0 };
          }
          acc[category].count += 1;
          acc[category].totalScore += activity.score || 0;
          return acc;
        }, {} as Record<string, { count: number; totalScore: number }>);

        return Object.entries(categories)
          .map(([category, data]) => ({
            category,
            count: data.count,
            avgScore: data.totalScore / data.count,
          }))
          .sort((a, b) => b.avgScore - a.avgScore);
      },

      getTotalStats: () => {
        const { activities } = get();
        const totalActivities = activities.length;
        const totalLoveVotes = activities.reduce(
          (sum, activity) => sum + activity.love_votes,
          0
        );
        const totalLikeVotes = activities.reduce(
          (sum, activity) => sum + activity.like_votes,
          0
        );
        const totalPassVotes = activities.reduce(
          (sum, activity) => sum + activity.pass_votes,
          0
        );
        const avgScore =
          totalActivities > 0
            ? activities.reduce(
                (sum, activity) => sum + (activity.score || 0),
                0
              ) / totalActivities
            : 0;

        return {
          totalActivities,
          totalLoveVotes,
          totalLikeVotes,
          totalPassVotes,
          avgScore,
        };
      },
      getBudgetAnalysis: () => {
        const { activities } = get();

        // Group activities by price ranges
        const priceRanges = {
          Free: activities.filter(
            (a) => a.price === "Free" || a.price === "$0"
          ),
          "Budget ($1-25)": activities.filter((a) => {
            const price = a.price.replace(/[^0-9.-]/g, "");
            const num = Number.parseFloat(price);
            return num > 0 && num <= 25;
          }),
          "Moderate ($26-50)": activities.filter((a) => {
            const price = a.price.replace(/[^0-9.-]/g, "");
            const num = Number.parseFloat(price);
            return num > 25 && num <= 50;
          }),
          "Premium ($51-100)": activities.filter((a) => {
            const price = a.price.replace(/[^0-9.-]/g, "");
            const num = Number.parseFloat(price);
            return num > 50 && num <= 100;
          }),
          "Luxury ($100+)": activities.filter((a) => {
            const price = a.price.replace(/[^0-9.-]/g, "");
            const num = Number.parseFloat(price);
            return num > 100;
          }),
        };

        return Object.entries(priceRanges)
          .map(([range, rangeActivities]) => {
            const avgScore =
              rangeActivities.length > 0
                ? rangeActivities.reduce((sum, a) => sum + (a.score || 0), 0) /
                  rangeActivities.length
                : 0;
            const bestValue =
              rangeActivities.length > 0
                ? rangeActivities.reduce((best, current) =>
                    (current.score || 0) > (best.score || 0) ? current : best
                  )
                : null;

            return {
              priceRange: range,
              activities: rangeActivities,
              avgScore,
              count: rangeActivities.length,
              bestValue,
            };
          })
          .filter((range) => range.count > 0);
      },

      getGroupDynamics: () => {
        const { activities } = get();

        const consensus = activities.filter(
          (a) => a.love_votes >= 2 && a.pass_votes === 0
        );

        const controversial = activities.filter(
          (a) =>
            a.love_votes >= 1 &&
            a.pass_votes >= 1 &&
            Math.abs(a.love_votes - a.pass_votes) <= 1
        );

        const polarizing = activities.filter(
          (a) => a.pass_votes >= 2 && a.love_votes >= 1
        );

        const unanimous = activities.filter(
          (a) => a.love_votes >= 3 && a.like_votes === 0 && a.pass_votes === 0
        );

        return { consensus, controversial, polarizing, unanimous };
      },

      getVotingPatterns: () => {
        const { activities } = get();
        const totalLove = activities.reduce((sum, a) => sum + a.love_votes, 0);
        const totalLike = activities.reduce((sum, a) => sum + a.like_votes, 0);
        const totalPass = activities.reduce((sum, a) => sum + a.pass_votes, 0);
        const totalVotes = totalLove + totalLike + totalPass;

        return {
          totalVotes,
          lovePercentage: totalVotes > 0 ? (totalLove / totalVotes) * 100 : 0,
          likePercentage: totalVotes > 0 ? (totalLike / totalVotes) * 100 : 0,
          passPercentage: totalVotes > 0 ? (totalPass / totalVotes) * 100 : 0,
          engagementScore: totalVotes / Math.max(activities.length, 1),
        };
      },

      getScoreDistribution: () => {
        const { activities } = get();
        const ranges = [
          { range: "Excellent (8+)", min: 8, max: Number.POSITIVE_INFINITY },
          { range: "Good (5-7)", min: 5, max: 7 },
          { range: "Average (2-4)", min: 2, max: 4 },
          { range: "Poor (0-1)", min: 0, max: 1 },
          { range: "Negative (<0)", min: Number.NEGATIVE_INFINITY, max: -1 },
        ];

        return ranges
          .map(({ range, min, max }) => {
            const count = activities.filter((a) => {
              const score = a.score || 0;
              return score >= min && score <= max;
            }).length;

            return {
              range,
              count,
              percentage:
                activities.length > 0 ? (count / activities.length) * 100 : 0,
            };
          })
          .filter((r) => r.count > 0);
      },

      getCategoryLeaders: () => {
        const { activities } = get();
        const categories = activities.reduce((acc, activity) => {
          const category = activity.category || "Other";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(activity);
          return acc;
        }, {} as Record<string, ActivityData[]>);

        return Object.entries(categories)
          .map(([category, categoryActivities]) => {
            const topActivity = categoryActivities.reduce((best, current) =>
              (current.score || 0) > (best.score || 0) ? current : best
            );
            const avgScore =
              categoryActivities.reduce((sum, a) => sum + (a.score || 0), 0) /
              categoryActivities.length;

            return {
              category,
              topActivity,
              avgScore,
              totalActivities: categoryActivities.length,
            };
          })
          .sort((a, b) => b.avgScore - a.avgScore);
      },
    }),
    {
      name: "activity-store",
      // Persist activities and isLoaded state only
      partialize: (state) => ({
        activities: state.activities,
        isLoaded: state.isLoaded,
      }),
    }
  )
);
