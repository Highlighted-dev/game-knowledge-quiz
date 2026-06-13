export type Language = "pl" | "en";

export const DEFAULT_TEAM_NAMES = {
  pl: ["Drużyna 1", "Drużyna 2"],
  en: ["Team 1", "Team 2"],
} as const;

const messages = {
  pl: {
    "hero.subtitle": "Wielki Turniej",
    "hero.title": "WIEDZY O GRACH",
    "gameBoard.loadingCategories": "Ładowanie kategorii...",
    "gameBoard.resetConfirm": "Czy na pewno chcesz zresetować grę?",
    "gameBoard.reset": "Resetuj",
    "gameBoard.bingoCellTooltip": "Część binga",
    "gameBoard.switchToEnglish": "Switch to English",
    "gameBoard.switchToPolish": "Przełącz na Polski",
    "gameBoard.spinWheel": "Koło",
    "wheel.title": "Kto zaczyna?",
    "wheel.spin": "Zakręć",
    "wheel.spinning": "Kręci się...",
    "wheel.goesFirst": "{name} zaczyna!",
    "wheel.continue": "Kontynuuj",
    "wheel.respinConfirm":
      "Czy na pewno chcesz zakręcić kołem ponownie? Obecny wynik zostanie usunięty.",
    "scoreBoard.goesFirst": "Zaczyna",
    "presetSelector.presets": "Presety",
    "presetSelector.selectPreset": "Wybierz preset",
    "presetSelector.activePreset": "Aktywny preset: ",
    "presetSelector.active": "aktywny",
    "presetSelector.reloadConfirm":
      'Czy na pewno chcesz przeładować preset "{label}"? Wszystkie postępy gry zostaną zresetowane.',
    "presetSelector.loadConfirm":
      'Czy na pewno chcesz załadować preset "{label}"? Plansza i wszystkie postępy gry (wyniki, odpowiedzi, bingo) zostaną zresetowane.',
    "presetSelector.loadFailed": "Nie udało się załadować presetu.",
    "presetSelector.loading": "Ładowanie...",
    "presetSelector.loadPreset": "Załaduj preset",
    "questionModal.abcdUsed": "ABCD użyte",
    "questionModal.noPoints": "Brak Punktów",
    "questionModal.phoneHint": "Drużyna może teraz zadzwonić do przyjaciela!",
    "questionModal.phoneTimer": "Host: Daj 30 sekund na rozmowę.",
    "questionModal.phoneUsed": "Telefon użyty",
    "questionModal.showAnswer": "Pokaż Odpowiedź",
    "questionModal.stealHint": "Drużyna może przejąć pytanie!",
    "questionModal.stealUsed": "Kradzież użyta",
    "questionModal.switchToPolish": "Przełącz na Polski",
    "scoreBoard.teamSlot": "Drużyna {num}",
    "scoreBoard.clickToRename": "Kliknij, aby zmienić nazwę",
    "scoreBoard.bingo": "Bingo {count}",
    "bingo.rowDetail": "{points} pkt rząd",
  },
  en: {
    "hero.subtitle": "The Great Tournament of",
    "hero.title": "GAME KNOWLEDGE",
    "gameBoard.loadingCategories": "Loading categories...",
    "gameBoard.resetConfirm": "Are you sure you want to reset the game?",
    "gameBoard.reset": "Reset",
    "gameBoard.bingoCellTooltip": "Part of a bingo",
    "gameBoard.switchToEnglish": "Switch to English",
    "gameBoard.switchToPolish": "Przełącz na Polski",
    "gameBoard.spinWheel": "Spin",
    "wheel.title": "Who goes first?",
    "wheel.spin": "Spin",
    "wheel.spinning": "Spinning...",
    "wheel.goesFirst": "{name} goes first!",
    "wheel.continue": "Continue",
    "wheel.respinConfirm":
      "Are you sure you want to spin again? The current result will be cleared.",
    "scoreBoard.goesFirst": "Goes first",
    "presetSelector.presets": "Presets",
    "presetSelector.selectPreset": "Select preset",
    "presetSelector.activePreset": "Active preset: ",
    "presetSelector.active": "active",
    "presetSelector.reloadConfirm":
      'Are you sure you want to reload preset "{label}"? All game progress will be reset.',
    "presetSelector.loadConfirm":
      'Are you sure you want to load preset "{label}"? The board and all game progress (scores, answers, bingos) will be reset.',
    "presetSelector.loadFailed": "Failed to load preset.",
    "presetSelector.loading": "Loading...",
    "presetSelector.loadPreset": "Load preset",
    "questionModal.abcdUsed": "ABCD used",
    "questionModal.noPoints": "No Points",
    "questionModal.phoneHint": "Team can now call a friend!",
    "questionModal.phoneTimer": "Host: Give 30 seconds for the call.",
    "questionModal.phoneUsed": "Phone used",
    "questionModal.showAnswer": "Reveal Answer",
    "questionModal.stealHint": "Team can steal this question!",
    "questionModal.stealUsed": "Steal used",
    "questionModal.switchToPolish": "Przełącz na Polski",
    "scoreBoard.teamSlot": "Team {num}",
    "scoreBoard.clickToRename": "Click to rename",
    "scoreBoard.bingo": "Bingo {count}",
    "bingo.rowDetail": "{points}pt row",
  },
} as const;

export type TranslationKey = keyof (typeof messages)["pl"];

export function t(
  key: TranslationKey,
  lang: Language,
  vars?: Record<string, string | number>,
): string {
  let text: string = messages[lang][key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}

export function getDefaultTeamName(index: 0 | 1, lang: Language): string {
  return DEFAULT_TEAM_NAMES[lang][index];
}

export function isDefaultTeamName(name: string): boolean {
  return (
    DEFAULT_TEAM_NAMES.pl.includes(
      name as (typeof DEFAULT_TEAM_NAMES.pl)[number],
    ) ||
    DEFAULT_TEAM_NAMES.en.includes(
      name as (typeof DEFAULT_TEAM_NAMES.en)[number],
    )
  );
}

export function migrateTeamsToLanguage(
  teams: [{ name: string }, { name: string }],
  fromLang: Language,
  toLang: Language,
): [{ name: string }, { name: string }] {
  return teams.map((team, index) => {
    const teamIndex = index as 0 | 1;
    if (team.name === getDefaultTeamName(teamIndex, fromLang)) {
      return { ...team, name: getDefaultTeamName(teamIndex, toLang) };
    }
    return team;
  }) as [{ name: string }, { name: string }];
}

export function formatBingoNotification(
  lang: Language,
  teamName: string,
  kind: "column" | "row",
  detail: string | number,
): string {
  if (kind === "column") {
    return `BINGO! ${teamName} +600 (${detail})`;
  }
  const rowDetail = t("bingo.rowDetail", lang, { points: detail });
  return `BINGO! ${teamName} +600 (${rowDetail})`;
}

export function getInitialTeamState(lang: Language) {
  return {
    hasLifelineABCD: true,
    hasLifelinePhone: true,
    hasLifelineSteal: true,
    score: 0,
  } as const;
}

export function getInitialTeams(lang: Language): [
  {
    id: string;
    name: string;
    score: number;
    hasLifelineABCD: boolean;
    hasLifelinePhone: boolean;
    hasLifelineSteal: boolean;
  },
  {
    id: string;
    name: string;
    score: number;
    hasLifelineABCD: boolean;
    hasLifelinePhone: boolean;
    hasLifelineSteal: boolean;
  },
] {
  const base = getInitialTeamState(lang);
  return [
    { ...base, id: "team1", name: getDefaultTeamName(0, lang) },
    { ...base, id: "team2", name: getDefaultTeamName(1, lang) },
  ];
}
