import type { Category } from "./store";

// Function to load categories from JSON file (client-side)
export async function loadCategoriesFromFile(): Promise<Category[]> {
  try {
    const response = await fetch("/preset3/categories3.json");
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
