import { desc, eq, sql } from "drizzle-orm";
import {
  activities,
  activityUploads,
  db,
  type ActivityData,
  type NewActivity,
  type NewActivityUpload,
} from "./index";

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

  // Transform to ActivityData format for frontend compatibility
  return results.map((activity) => ({
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
  }));
}

export async function getAllActivities(): Promise<ActivityData[]> {
  const results = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.createdAt));

  // Transform to ActivityData format for frontend compatibility
  return results.map((activity) => ({
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
  }));
}

// Statistics and Analytics
export async function getActivityStats() {
  const [totalStats] = await db
    .select({
      totalActivities: sql<number>`count(*)::int`,
      totalLoveVotes: sql<number>`sum(${activities.loveVotes})::int`,
      totalLikeVotes: sql<number>`sum(${activities.likeVotes})::int`,
      totalPassVotes: sql<number>`sum(${activities.passVotes})::int`,
      avgScore: sql<number>`avg(${activities.score})::float`,
    })
    .from(activities);

  return totalStats;
}

export async function getCategoryStats() {
  return await db
    .select({
      category: activities.category,
      count: sql<number>`count(*)::int`,
      avgScore: sql<number>`avg(${activities.score})::float`,
    })
    .from(activities)
    .groupBy(activities.category);
}

export async function getTopActivities(limit: number = 10) {
  const results = await db
    .select()
    .from(activities)
    .orderBy(desc(activities.score))
    .limit(limit);

  // Transform to ActivityData format
  return results.map((activity) => ({
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
  }));
}

// Transactional upload and insert
export async function uploadActivitiesWithTransaction(
  uploadData: Omit<NewActivityUpload, "id" | "uploadedAt">,
  activitiesData: ActivityData[]
) {
  return await db.transaction(async (tx) => {
    const [upload] = await tx
      .insert(activityUploads)
      .values(uploadData)
      .returning();
    if (!upload) throw new Error("Failed to create upload record");

    if (activitiesData.length === 0) return { upload, insertedActivities: [] };

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
    return { upload, insertedActivities };
  });
}

// Clean up old uploads (optional utility)
export async function deleteActivityUpload(uploadId: string) {
  // This will cascade delete all related activities
  await db.delete(activityUploads).where(eq(activityUploads.id, uploadId));
}
