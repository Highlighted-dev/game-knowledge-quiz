export type Preset = {
  id: string;
  label: string;
  description: string;
  path: string;
};

export const DEFAULT_PRESET_ID = "preset5";

export const PRESETS: Preset[] = [
  {
    id: "preset1",
    label: "Preset 1",
    description:
      "Lethal Company, WoW, Helldivers, Fortnite, Bloons TD, Payday",
    path: "/preset1/categories.json",
  },
  {
    id: "preset2",
    label: "Preset 2",
    description:
      "Fifa, EA (studio), Monster Hunter, League of Legends, Batman: Arkham, Fighter Games",
    path: "/preset2/categories2.json",
  },
  {
    id: "preset3",
    label: "Preset 3",
    description:
      "Rockstar Games, Borderlands, Mass Effect, Pokemon, Left4Dead, Stardew Valley",
    path: "/preset3/categories3.json",
  },
  {
    id: "preset4",
    label: "Preset 4",
    description:
      "Red Dead Redemption, Civilization, GTA, Witcher, Counter-Strike, Minecraft",
    path: "/preset4/categories4.json",
  },
  {
    id: "preset5",
    label: "Preset 5",
    description:
      "The Sims, E-sport, Half-Life, Clash Royale, The Last Of Us, Fallout",
    path: "/preset5/categories5.json",
  },
];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
