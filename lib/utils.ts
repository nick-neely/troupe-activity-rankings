import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ActivityData {
  name: string;
  category: string;
  price: string;
  love_votes: number;
  like_votes: number;
  pass_votes: number;
  score?: number;
  groupNames?: string;
  website_link?: string;
  google_maps_url?: string;
}

export function calculateScore(activity: ActivityData): number {
  return (
    activity.love_votes * 2 + activity.like_votes * 1 + activity.pass_votes * -1
  );
}

export function parseCSVData(csvText: string): ActivityData[] {
  const lines = csvText.trim().split("\n");

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line); // Use the new robust parser
    const activity: ActivityData = {
      name: values[0] ? values[0].replace(/^"|"$/g, "") : "", // Remove quotes if present
      category: values[1] ? values[1].replace(/^"|"$/g, "") : "",
      price: values[2] ? values[2].replace(/^"|"$/g, "") : "N/A",
      love_votes: Number.parseInt(values[3]) || 0,
      like_votes: Number.parseInt(values[4]) || 0,
      pass_votes: Number.parseInt(values[5]) || 0,
      website_link: values[6] ? values[6].replace(/^"|"$/g, "") : "",
      google_maps_url: values[7] ? values[7].replace(/^"|"$/g, "") : "",
      groupNames: values[8] ? values[8].replace(/^"|"$/g, "") : "",
    };
    activity.score = calculateScore(activity);
    return activity;
  });
}

// Add this new helper function for robust CSV line parsing
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let inQuote = false;
  let currentField = "";

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Handle escaped double quotes within a field (e.g., "" -> ")
      if (inQuote && line[i + 1] === '"') {
        currentField += '"';
        i++; // Skip the next quote
      } else {
        inQuote = !inQuote;
      }
    } else if (char === "," && !inQuote) {
      result.push(currentField);
      currentField = "";
    } else {
      currentField += char;
    }
  }
  result.push(currentField); // Add the last field
  return result;
}
