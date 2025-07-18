import bcrypt from "bcrypt";
import { desc, eq, sql } from "drizzle-orm";
import {
  activities,
  Activity,
  activityUploads,
  db,
  users,
  type ActivityData,
  type NewActivity,
  type NewActivityUpload,
  type User,
} from "./index";

// Helper: transform DB row to ActivityData
function toActivityData(activity: Activity): ActivityData {
  return {
    id: activity.id,
    name: activity.name,
    category: activity.category,
    price: activity.price || "N/A",
    love_votes: activity.loveVotes,
    like_votes: activity.likeVotes,
    pass_votes: activity.passVotes,
    score: activity.score,
    groupNames: activity.groupNames || undefined,
    website_link: activity.websiteLink || undefined,
    google_maps_url: activity.googleMapsUrl || undefined,
    uploadId: activity.uploadId,
    createdAt: activity.createdAt,
  };
}
// Activity Upload Operations
export async function createActivityUpload(
  data: Omit<NewActivityUpload, "id" | "uploadedAt">
) {
  const [upload] = await db.insert(activityUploads).values(data).returning();
  return upload;
}

export async function getActivityUploads() {
  return await db
    .select()
    .from(activityUploads)
    .orderBy(desc(activityUploads.uploadedAt));
}

export async function getLatestActivityUpload() {
  const [upload] = await db
    .select()
    .from(activityUploads)
    .orderBy(desc(activityUploads.uploadedAt))
    .limit(1);
  return upload;
}

// Activity Operations
export async function createActivities(
  data: Omit<NewActivity, "id" | "createdAt">[]
) {
  if (data.length === 0) return [];
  return await db.insert(activities).values(data).returning();
}

export async function getActivitiesByUploadId(uploadId: string) {
  return await db
    .select()
    .from(activities)
    .where(eq(activities.uploadId, uploadId));
}

export async function getLatestActivities(): Promise<ActivityData[]> {
  const latestUpload = await getLatestActivityUpload();
  if (!latestUpload) return [];

  const results = await db
    .select()
    .from(activities)
    .where(eq(activities.uploadId, latestUpload.id));

  return results.map(toActivityData);
}

export async function getAllActivities(): Promise<ActivityData[]> {
  const results = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.createdAt));

  return results.map(toActivityData);
}

// Statistics and Analytics
export async function getActivityStats(): Promise<{
  totalActivities: number;
  totalLoveVotes: number;
  totalLikeVotes: number;
  totalPassVotes: number;
  avgScore: number;
}> {
  const [totalStats] = await db
    .select({
      totalActivities: sql<number>`count(*)::int`,
      totalLoveVotes: sql<number>`COALESCE(sum(${activities.loveVotes}), 0)::int`,
      totalLikeVotes: sql<number>`COALESCE(sum(${activities.likeVotes}), 0)::int`,
      totalPassVotes: sql<number>`COALESCE(sum(${activities.passVotes}), 0)::int`,
      avgScore: sql<number>`COALESCE(avg(${activities.score}), 0)::float`,
    })
    .from(activities);

  return totalStats;
}

export async function getCategoryStats(): Promise<
  Array<{
    category: string;
    count: number;
    avgScore: number;
  }>
> {
  return await db
    .select({
      category: activities.category,
      count: sql<number>`count(*)::int`,
      avgScore: sql<number>`COALESCE(avg(${activities.score}), 0)::float`,
    })
    .from(activities)
    .groupBy(activities.category);
}

export async function getTopActivities(
  limit: number = 10
): Promise<ActivityData[]> {
  const results = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.score))
    .limit(limit);

  return results.map(toActivityData);
}

// Transactional upload and insert
export async function uploadActivitiesWithTransaction(
  uploadData: Omit<NewActivityUpload, "id" | "uploadedAt">,
  activitiesData: ActivityData[]
) {
  if (!uploadData.fileName || !uploadData.totalActivities) {
    throw new Error(
      "Invalid upload data: fileName and totalActivities are required"
    );
  }

  if (uploadData.totalActivities !== activitiesData.length) {
    throw new Error(
      `Mismatch: expected ${uploadData.totalActivities} activities, got ${activitiesData.length}`
    );
  }

  return await db.transaction(async (tx) => {
    const [upload] = await tx
      .insert(activityUploads)
      .values(uploadData)
      .returning();
    if (!upload) throw new Error("Failed to create upload record");

    if (activitiesData.length === 0) return { upload, insertedActivities: [] };

    for (const activity of activitiesData) {
      if (!activity.name || !activity.category) {
        throw new Error(
          `Invalid activity data: name and category are required for activity: ${JSON.stringify(
            activity
          )}`
        );
      }
    }

    const activitiesToInsert = activitiesData.map((activity) => ({
      uploadId: upload.id,
      name: activity.name,
      category: activity.category,
      price: activity.price || "N/A",
      loveVotes: activity.love_votes,
      likeVotes: activity.like_votes,
      passVotes: activity.pass_votes,
      score: activity.score || 0,
      groupNames: activity.groupNames,
      websiteLink: activity.website_link,
      googleMapsUrl: activity.google_maps_url,
    }));

    const insertedActivities = await tx
      .insert(activities)
      .values(activitiesToInsert)
      .returning();

    if (insertedActivities.length !== activitiesData.length) {
      throw new Error(
        `Insert failed: expected ${activitiesData.length} activities, inserted ${insertedActivities.length}`
      );
    }

    return { upload, insertedActivities };
  });
}

// Clean up old uploads (optional utility)
export async function deleteActivityUpload(uploadId: string) {
  if (!uploadId) {
    throw new Error("Upload ID is required for deletion");
  }

  const existingUpload = await db
    .select({ id: activityUploads.id })
    .from(activityUploads)
    .where(eq(activityUploads.id, uploadId))
    .limit(1);
  if (existingUpload.length === 0) {
    throw new Error(`Upload with ID ${uploadId} not found`);
  }

  const result = await db
    .delete(activityUploads)
    .where(eq(activityUploads.id, uploadId));
  return result;
}

// User Operations
export async function createUser(username: string, password: string) {
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const [user] = await db
    .insert(users)
    .values({
      username,
      passwordHash,
    })
    .returning();

  return user;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return user || null;
}

export async function validateUserPassword(
  username: string,
  password: string
): Promise<User | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

// Initialize admin user (run once)
export async function initializeAdminUser() {
  const existingUser = await getUserByUsername("admin");
  if (existingUser) {
    console.log("Admin user already exists");
    return existingUser;
  }

  // Get default password from env or parameter
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!defaultPassword) {
    throw new Error("ADMIN_DEFAULT_PASSWORD environment variable is not set");
  }
  const adminUser = await createUser("admin", defaultPassword);
  console.log(
    "Admin user created with username 'admin'. Please change the password after first login."
  );
  // Do not log the password
  return adminUser;
}
