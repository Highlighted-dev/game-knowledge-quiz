import type { Category } from "./store";

// This file is now just a fallback.
// The main data is loaded from /public/data/categories.json via the API.

export const MOCK_CATEGORIES: Category[] = [];

// Function to load categories from JSON file (client-side)
export async function loadCategoriesFromFile(): Promise<Category[]> {
  try {
    const response = await fetch("/data/categories.json");
    if (!response.ok) {
      throw new Error("Failed to load categories");
    }
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Failed to load categories from file:", error);
    return [];
  }
}
