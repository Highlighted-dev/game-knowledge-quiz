import { DEFAULT_PRESET_ID, getPresetById } from "./presets";
import type { Category } from "./store";

export async function loadCategoriesFromPreset(
  presetId: string,
): Promise<Category[]> {
  const preset = getPresetById(presetId);
  if (!preset) {
    console.error(`Unknown preset id: ${presetId}`);
    return [];
  }

  try {
    const response = await fetch(preset.path);
    if (!response.ok) {
      throw new Error(`Failed to load categories from ${preset.path}`);
    }
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Failed to load categories from file:", error);
    return [];
  }
}

/** @deprecated Use loadCategoriesFromPreset instead */
export async function loadCategoriesFromFile(): Promise<Category[]> {
  return loadCategoriesFromPreset(DEFAULT_PRESET_ID);
}
