import bcrypt from "bcrypt";
import { and, desc, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import {
  activities,
  Activity,
  activityUploads,
  appConfig,
  broadcasts,
  categoryIconMappings,
  db,
  users,
  type ActivityData,
  type Broadcast,
  type CategoryIconMapping,
  type NewActivity,
  type NewActivityUpload,
  type NewBroadcast,
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
export async function uploadActivities(
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

  // Insert upload record
  const [upload] = await db
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

  const insertedActivities = await db
    .insert(activities)
    .values(activitiesToInsert)
    .returning();

  if (insertedActivities.length !== activitiesData.length) {
    throw new Error(
      `Insert failed: expected ${activitiesData.length} activities, inserted ${insertedActivities.length}`
    );
  }

  return { upload, insertedActivities };
}

/**
 * Deletes an activity upload record by its ID.
 *
 * Throws an error if the upload ID is missing or if the upload does not exist.
 *
 * @param uploadId - The unique identifier of the activity upload to delete
 * @returns The result of the deletion operation
 */
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

/**
 * Creates a new user with the specified username and password.
 *
 * The password is securely hashed before storage.
 *
 * @param username - The username for the new user
 * @param password - The plaintext password for the new user
 * @returns The created user record
 */
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

/**
 * Retrieves a user by their username.
 *
 * @param username - The username to search for
 * @returns The user object if found, otherwise null
 */
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

/**
 * Verifies a user's password and returns the user if authentication succeeds.
 *
 * Retrieves the user by username and compares the provided password with the stored password hash. Returns the user object if the password is valid; otherwise, returns null.
 *
 * @param username - The username of the user to authenticate
 * @param password - The plaintext password to verify
 * @returns The authenticated user if the password is correct, or null if authentication fails
 */
export async function validateUserPassword(
  username: string,
  password: string
): Promise<User | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
}

/**
 * Ensures that an admin user exists by creating one with a default password if necessary.
 *
 * If an admin user already exists, returns the existing user. If not, creates an admin user using the password from the `ADMIN_DEFAULT_PASSWORD` environment variable. Throws an error if the environment variable is not set.
 *
 * @returns The existing or newly created admin user
 */
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

// Category Icon Mapping Operations

/**
 * Gets all category icon mappings from the database.
 *
 * @returns Array of category icon mappings
 */
export async function getCategoryIconMappings(): Promise<
  CategoryIconMapping[]
> {
  return await db
    .select()
    .from(categoryIconMappings)
    .orderBy(categoryIconMappings.category);
}

/**
 * Creates or updates a category icon mapping.
 *
 * @param category - The category name
 * @param iconName - The icon name to map to the category
 * @returns The created or updated mapping
 */
export async function setCategoryIconMapping(
  category: string,
  iconName: string
): Promise<CategoryIconMapping> {
  if (!category || !iconName) {
    throw new Error("Category and iconName are required");
  }

  const [result] = await db
    .insert(categoryIconMappings)
    .values({
      category,
      iconName,
    })
    .onConflictDoUpdate({
      target: categoryIconMappings.category,
      set: {
        iconName,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!result) {
    throw new Error("Failed to create category icon mapping");
  }

  return result;
}

/**
 * Gets a single category icon mapping by category name.
 *
 * @param category - The category name to look up
 * @returns The mapping if found, null otherwise
 */
export async function getCategoryIconMapping(
  category: string
): Promise<CategoryIconMapping | null> {
  if (!category) {
    return null;
  }

  const [mapping] = await db
    .select()
    .from(categoryIconMappings)
    .where(eq(categoryIconMappings.category, category))
    .limit(1);

  return mapping || null;
}

/**
 * Initializes default category icon mappings for common categories.
 * Only creates mappings that don't already exist.
 *
 * @returns Array of created mappings (if any)
 */
export async function initializeDefaultCategoryMappings(): Promise<
  CategoryIconMapping[]
> {
  const defaultMappings = [
    { category: "Food", iconName: "UtensilsCrossed" },
    { category: "Entertainment", iconName: "Music" },
    { category: "Recreation", iconName: "Zap" },
    { category: "Outdoors", iconName: "Trees" },
    { category: "Wellness", iconName: "Heart" },
    { category: "Dining", iconName: "ChefHat" },
    { category: "Gaming", iconName: "Gamepad2" },
    { category: "Movies", iconName: "Film" },
    { category: "Sports", iconName: "Trophy" },
    { category: "Shopping", iconName: "ShoppingBag" },
  ];

  const createdMappings: CategoryIconMapping[] = [];
  const errors: Array<{ category: string; error: unknown }> = [];

  for (const mapping of defaultMappings) {
    const existing = await getCategoryIconMapping(mapping.category);
    if (!existing) {
      try {
        const created = await setCategoryIconMapping(
          mapping.category,
          mapping.iconName
        );
        createdMappings.push(created);
      } catch (error) {
        console.warn(
          `Failed to create default mapping for ${mapping.category}:`,
          error
        );
        errors.push({ category: mapping.category, error });
      }
      if (errors.length > 0) {
        console.error("Some default mappings failed to initialize:", errors);
      }
    }
  }

  return createdMappings;
}

export async function getCategoryMappingsInitializedFlag(): Promise<boolean> {
  const result = await db
    .select()
    .from(appConfig)
    .where(eq(appConfig.key, "categoryMappingsInitialized"))
    .limit(1);
  return result.length > 0 && JSON.parse(result[0].value || "false");
}

export async function setCategoryMappingsInitializedFlag(
  value: boolean
): Promise<void> {
  // Upsert the flag
  const exists = await db
    .select()
    .from(appConfig)
    .where(eq(appConfig.key, "categoryMappingsInitialized"))
    .limit(1);
  if (exists.length > 0) {
    await db
      .update(appConfig)
      .set({ value: JSON.stringify(value) })
      .where(eq(appConfig.key, "categoryMappingsInitialized"));
  } else {
    await db.insert(appConfig).values({
      key: "categoryMappingsInitialized",
      value: JSON.stringify(value),
    });
  }
}

export async function getActiveBroadcasts(): Promise<Broadcast[]> {
  const now = new Date();

  return await db
    .select()
    .from(broadcasts)
    .where(
      and(
        eq(broadcasts.active, true),
        // No start time set, or start time is in the past
        or(isNull(broadcasts.startsAt), lte(broadcasts.startsAt, now)),
        // No end time set, or end time is in the future
        or(isNull(broadcasts.endsAt), gte(broadcasts.endsAt, now))
      )
    )
    .orderBy(desc(broadcasts.updatedAt));
}
/**
 * Creates a new broadcast.
 *
 * @param data - The broadcast data to create
 * @returns The created broadcast
 */
export async function createBroadcast(
  data: Omit<NewBroadcast, "id" | "version" | "createdAt" | "updatedAt">
): Promise<Broadcast> {
  const [broadcast] = await db
    .insert(broadcasts)
    .values({
      ...data,
      version: 1,
    })
    .returning();

  if (!broadcast) {
    throw new Error("Failed to create broadcast");
  }

  return broadcast;
}

/**
 * Updates an existing broadcast and increments version if significant fields changed.
 *
 * @param id - The broadcast ID to update
 * @param data - The updated broadcast data
 * @returns The updated broadcast
 */
export async function updateBroadcast(
  id: number,
  data: Partial<Omit<NewBroadcast, "id" | "createdAt" | "updatedAt">>
): Promise<Broadcast> {
  const existing = await db
    .select()
    .from(broadcasts)
    .where(eq(broadcasts.id, id))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("Broadcast not found");
  }

  const existingBroadcast = existing[0];

  // Check if significant fields changed (content that would affect display)
  const significantChanged =
    (data.title !== undefined && data.title !== existingBroadcast.title) ||
    (data.bodyMarkdown !== undefined &&
      data.bodyMarkdown !== existingBroadcast.bodyMarkdown) ||
    (data.level !== undefined && data.level !== existingBroadcast.level) ||
    (data.startsAt !== undefined &&
      data.startsAt?.getTime() !== existingBroadcast.startsAt?.getTime()) ||
    (data.endsAt !== undefined &&
      data.endsAt?.getTime() !== existingBroadcast.endsAt?.getTime());

  const [updated] = await db
    .update(broadcasts)
    .set({
      ...data,
      version: significantChanged
        ? existingBroadcast.version + 1
        : existingBroadcast.version,
      updatedAt: new Date(),
    })
    .where(eq(broadcasts.id, id))
    .returning();

  if (!updated) {
    throw new Error("Failed to update broadcast");
  }

  return updated;
}

/**
 * Gets all broadcasts (for admin management).
 *
 * @returns Array of all broadcasts
 */
export async function getAllBroadcasts(): Promise<Broadcast[]> {
  return await db.select().from(broadcasts).orderBy(desc(broadcasts.updatedAt));
}

/**
 * Gets a single broadcast by ID.
 *
 * @param id - The broadcast ID
 * @returns The broadcast if found, null otherwise
 */
export async function getBroadcastById(id: number): Promise<Broadcast | null> {
  const [broadcast] = await db
    .select()
    .from(broadcasts)
    .where(eq(broadcasts.id, id))
    .limit(1);

  return broadcast || null;
}

/**
 * Deletes a broadcast by ID.
 *
 * @param id - The broadcast ID to delete
 * @returns The deletion result
 */
export async function deleteBroadcast(id: number) {
  const existing = await getBroadcastById(id);
  if (!existing) {
    throw new Error("Broadcast not found");
  }

  return await db.delete(broadcasts).where(eq(broadcasts.id, id));
}
