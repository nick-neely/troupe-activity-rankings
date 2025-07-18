import { getAuthUser } from "@/lib/auth";
import {
  getCategoryIconMappings,
  getCategoryMappingsInitializedFlag,
  initializeDefaultCategoryMappings,
  setCategoryIconMapping,
  setCategoryMappingsInitializedFlag,
} from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const alreadyInitialized = await getCategoryMappingsInitializedFlag();
    if (!alreadyInitialized) {
      await initializeDefaultCategoryMappings();
      await setCategoryMappingsInitializedFlag(true);
    }

    const mappings = await getCategoryIconMappings();
    return NextResponse.json({ mappings });
  } catch (error) {
    console.error("Error fetching category mappings:", error);
    return NextResponse.json(
      { error: "Failed to fetch category mappings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, iconName } = await request.json();

    if (!category || !iconName) {
      return NextResponse.json(
        { error: "Category and iconName are required" },
        { status: 400 }
      );
    }

    const trimmedCategory = category.trim();
    if (typeof category !== "string" || trimmedCategory.length === 0) {
      return NextResponse.json(
        { error: "Category must be a non-empty string" },
        { status: 400 }
      );
    }

    const trimmedIconName = iconName.trim();
    if (typeof iconName !== "string" || trimmedIconName.length === 0) {
      return NextResponse.json(
        { error: "IconName must be a non-empty string" },
        { status: 400 }
      );
    }

    const mapping = await setCategoryIconMapping(category, iconName);
    return NextResponse.json({ mapping });
  } catch (error) {
    console.error("Error updating category mapping:", error);
    return NextResponse.json(
      { error: "Failed to update category mapping" },
      { status: 500 }
    );
  }
}
