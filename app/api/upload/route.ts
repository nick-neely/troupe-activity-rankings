import { uploadActivities } from "@/lib/db/queries";
import { type ActivityData } from "@/lib/db/schema";
import { calculateScore, parseCSVData } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv") && !file.type.includes("csv")) {
      return NextResponse.json(
        { error: "File must be a CSV" },
        { status: 400 }
      );
    }
    // Read and parse CSV data (returns CSVActivityData[])
    const csvText = await file.text();
    const parsedActivities = parseCSVData(csvText);

    if (parsedActivities.length === 0) {
      return NextResponse.json(
        { error: "No valid activities found in CSV" },
        { status: 400 }
      );
    }

    // Convert CSV data to database-compatible ActivityData format
    const dbActivities: ActivityData[] = parsedActivities.map((activity) => ({
      ...activity,
      score: activity.score ?? calculateScore(activity),
    }));

    // Create upload record and insert activities in a transaction
    const { upload, insertedActivities } = await uploadActivities(
      {
        fileName: file.name,
        totalActivities: parsedActivities.length,
        description: description || undefined,
      },
      dbActivities
    );

    return NextResponse.json(
      {
        message: "Activities uploaded successfully",
        upload: {
          id: upload.id,
          fileName: upload.fileName,
          totalActivities: upload.totalActivities,
          uploadedAt: upload.uploadedAt,
        },
        activitiesCount: insertedActivities.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading activities:", error);
    return NextResponse.json(
      { error: "Failed to upload activities" },
      { status: 500 }
    );
  }
}
