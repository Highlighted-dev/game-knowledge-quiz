import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QuestionType = "OPEN" | "ABCD" | "IMAGE" | "AUDIO";

export type Question = {
  id: string;
  points: number;
  type: QuestionType;
  question: { pl: string; en: string };
  answer: { pl: string; en: string };
  options?: { pl: string[]; en: string[] }; // For ABCD
  mediaUrl?: string; // For IMAGE/AUDIO
  isAnswered: boolean;
  answeredBy?: string | null;
};

export type Category = {
  id: string;
  name: string;
  questions: Question[];
};

export type Team = {
  id: string;
  name: string;
  score: number;
  hasLifelineABCD: boolean;
  hasLifelinePhone: boolean;
  hasLifelineSteal: boolean;
};

export type GameState = {
  teams: [Team, Team];
  categories: Category[];
  activeQuestion: Question | null;
  activeCategory: string | null;
  lifelineActive: { teamId: string; type: "abcd" | "phone" | "steal" } | null;
  awardedBingos: string[];
  language: "pl" | "en";
  bingoNotification: string | null;
  doublePointQuestions: string[]; // Array of question IDs that give 2x points

  // Actions
  setTeamName: (teamId: string, name: string) => void;
  updateScore: (teamId: string, points: number) => void;
  openQuestion: (categoryId: string, questionId: string) => void;
  closeQuestion: () => void;
  markQuestionAnswered: (
    categoryId: string,
    questionId: string,
    answeredBy: string | null,
  ) => void;
  changeQuestionResult: (
    categoryId: string,
    questionId: string,
    newAnsweredBy: string | null,
    oldAnsweredBy: string | null,
    points: number,
  ) => void;
  resetGame: () => void;
  loadCategories: (categories: Category[]) => void;
  useLifeline: (teamId: string, type: "abcd" | "phone" | "steal") => void;
  clearLifeline: () => void;
  checkAndAwardBingo: () => void;
  setLanguage: (lang: "pl" | "en") => void;
  clearBingoNotification: () => void;
  initializeDoublePoints: () => void;
  isDoublePoints: (questionId: string) => boolean;
};

const INITIAL_TEAMS: [Team, Team] = [
  {
    hasLifelineABCD: true,
    hasLifelinePhone: true,
    hasLifelineSteal: true,
    id: "team1",
    name: "Drużyna 1",
    score: 0,
  },
  {
    hasLifelineABCD: true,
    hasLifelinePhone: true,
    hasLifelineSteal: true,
    id: "team2",
    name: "Drużyna 2",
    score: 0,
  },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      activeCategory: null,
      activeQuestion: null,
      awardedBingos: [],
      bingoNotification: null,
      categories: [],

      changeQuestionResult: (
        categoryId,
        questionId,
        newAnsweredBy,
        oldAnsweredBy,
        points,
      ) =>
        set((state) => {
          // Calculate points to adjust (considering double points)
          const isDouble = state.doublePointQuestions.includes(questionId);
          const actualPoints = isDouble ? points * 2 : points;

          // Create updated categories first
          const updatedCategories = state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  questions: c.questions.map((q) =>
                    q.id === questionId
                      ? { ...q, answeredBy: newAnsweredBy }
                      : q,
                  ),
                }
              : c,
          );

          // Check which bingos are now broken and should be removed
          const bingosToRemove: { key: string; teamId: string }[] = [];

          for (const bingoKey of state.awardedBingos) {
            // Parse bingo key: "h-{catIdx}-{teamId}" or "v-{rowIdx}-{teamId}"
            const parts = bingoKey.split("-");
            const type = parts[0];
            const idx = Number.parseInt(parts[1], 10);
            const teamId = parts[2];
            const opposingTeamId = teamId === "team1" ? "team2" : "team1";

            let isBroken = false;

            if (type === "h") {
              // Horizontal bingo - check if at least 5 questions in category still not answered by opposing team
              const cat = updatedCategories[idx];
              if (cat) {
                const matches = cat.questions.filter(
                  (q) => q.isAnswered && q.answeredBy !== opposingTeamId,
                ).length;
                if (matches < 5) {
                  isBroken = true;
                }
              }
            } else if (type === "v") {
              // Vertical bingo - check if at least 5 questions in row still not answered by opposing team
              const rowQuestions = updatedCategories
                .map((cat) => cat.questions[idx])
                .filter(Boolean);
              const matches = rowQuestions.filter(
                (q) => q.isAnswered && q.answeredBy !== opposingTeamId,
              ).length;
              if (matches < 5) {
                isBroken = true;
              }
            }

            if (isBroken) {
              bingosToRemove.push({ key: bingoKey, teamId });
            }
          }

          // Calculate team score changes
          const teamScoreChanges: Record<string, number> = {};

          // Points from question change
          if (oldAnsweredBy) {
            teamScoreChanges[oldAnsweredBy] =
              (teamScoreChanges[oldAnsweredBy] || 0) - actualPoints;
          }
          if (newAnsweredBy) {
            teamScoreChanges[newAnsweredBy] =
              (teamScoreChanges[newAnsweredBy] || 0) + actualPoints;
          }

          // Remove bingo bonus points (600 each)
          for (const { teamId } of bingosToRemove) {
            teamScoreChanges[teamId] = (teamScoreChanges[teamId] || 0) - 600;
          }

          return {
            awardedBingos: state.awardedBingos.filter(
              (key) => !bingosToRemove.some((b) => b.key === key),
            ),
            categories: updatedCategories,
            teams: state.teams.map((t) => ({
              ...t,
              score: t.score + (teamScoreChanges[t.id] || 0),
            })) as [Team, Team],
          };
        }),

      checkAndAwardBingo: () => {
        const state = get();
        const { categories, awardedBingos, teams } = state;
        if (categories.length === 0) return;

        for (const team of teams) {
          const teamId = team.id;
          const opposingTeamId = teamId === "team1" ? "team2" : "team1";

          // Check horizontal (at least 5 questions in a category not answered by opposing team)
          for (let catIdx = 0; catIdx < categories.length; catIdx++) {
            const cat = categories[catIdx];
            const matches = cat.questions.filter(
              (q) => q.isAnswered && q.answeredBy !== opposingTeamId,
            ).length;
            const bingoKey = `h-${catIdx}-${teamId}`;

            console.log(`[BINGO CHECK] Horiz - Team: ${team.name}, Cat: ${cat.name}, Matches: ${matches}/${cat.questions.length}, Key: ${bingoKey}, Already Awarded: ${awardedBingos.includes(bingoKey)}`);

            if (matches >= 5 && !awardedBingos.includes(bingoKey)) {
              console.log(`[BINGO AWARD] Horizontal Bingo! Key: ${bingoKey}`);
              set((s) => ({
                awardedBingos: [...s.awardedBingos, bingoKey],
                bingoNotification: `BINGO! ${team.name} +600 (${cat.name})`,
                teams: s.teams.map((t) =>
                  t.id === teamId ? { ...t, score: t.score + 600 } : t,
                ) as [Team, Team],
              }));
              return;
            }
          }

          // Check vertical (at least 5 questions in a row not answered by opposing team)
          for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
            const rowQuestions = categories
              .map((cat) => cat.questions[rowIdx])
              .filter(Boolean);
            const matches = rowQuestions.filter(
              (q) => q.isAnswered && q.answeredBy !== opposingTeamId,
            ).length;
            const bingoKey = `v-${rowIdx}-${teamId}`;

            console.log(`[BINGO CHECK] Vert - Team: ${team.name}, RowIdx: ${rowIdx}, Matches: ${matches}/${rowQuestions.length}, Key: ${bingoKey}, Already Awarded: ${awardedBingos.includes(bingoKey)}`);

            if (matches >= 5 && !awardedBingos.includes(bingoKey)) {
              const points = [100, 200, 300, 400, 500, 600][rowIdx];
              console.log(`[BINGO AWARD] Vertical Bingo! Key: ${bingoKey}`);
              set((s) => ({
                awardedBingos: [...s.awardedBingos, bingoKey],
                bingoNotification: `BINGO! ${team.name} +600 (${points}pkt rząd)`,
                teams: s.teams.map((t) =>
                  t.id === teamId ? { ...t, score: t.score + 600 } : t,
                ) as [Team, Team],
              }));
              return;
            }
          }
        }
      },

      clearBingoNotification: () => set({ bingoNotification: null }),

      clearLifeline: () => set({ lifelineActive: null }),

      closeQuestion: () =>
        set({
          activeCategory: null,
          activeQuestion: null,
          lifelineActive: null,
        }),
      doublePointQuestions: [],

      initializeDoublePoints: () => {
        const state = get();
        const allQuestionIds: string[] = [];
        for (const cat of state.categories) {
          for (const q of cat.questions) {
            allQuestionIds.push(q.id);
          }
        }
        // Randomly pick 2 unique questions
        const shuffled = [...allQuestionIds].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 2);
        set({ doublePointQuestions: selected });
      },

      isDoublePoints: (questionId) => {
        return get().doublePointQuestions.includes(questionId);
      },
      language: "pl",
      lifelineActive: null,

      loadCategories: (newCategories) => {
        const state = get();
        // Merge: keep answered state from saved categories if IDs match
        const mergedCategories = newCategories.map((newCat) => {
          const savedCat = state.categories.find((c) => c.id === newCat.id);
          if (!savedCat) return newCat;

          return {
            ...newCat,
            questions: newCat.questions.map((newQ) => {
              const savedQ = savedCat.questions.find((q) => q.id === newQ.id);
              if (!savedQ) return newQ;
              return {
                ...newQ,
                answeredBy: savedQ.answeredBy,
                isAnswered: savedQ.isAnswered,
              };
            }),
          };
        });
        set({ categories: mergedCategories });

        // Initialize double points if not already set
        if (state.doublePointQuestions.length === 0) {
          get().initializeDoublePoints();
        }
      },

      markQuestionAnswered: (categoryId, questionId, answeredBy) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  questions: c.questions.map((q) =>
                    q.id === questionId
                      ? { ...q, answeredBy, isAnswered: true }
                      : q,
                  ),
                }
              : c,
          ),
        })),

      openQuestion: (categoryId, questionId) =>
        set((state) => {
          const category = state.categories.find((c) => c.id === categoryId);
          const question = category?.questions.find((q) => q.id === questionId);
          return {
            activeCategory: categoryId,
            activeQuestion: question || null,
            lifelineActive: null,
          };
        }),

      resetGame: () => {
        set({
          activeQuestion: null,
          awardedBingos: [],
          bingoNotification: null,
          categories: get().categories.map((c) => ({
            ...c,
            questions: c.questions.map((q) => ({
              ...q,
              answeredBy: null,
              isAnswered: false,
            })),
          })),
          doublePointQuestions: [],
          lifelineActive: null,
          teams: INITIAL_TEAMS,
        });
        // Re-initialize double points for new game
        get().initializeDoublePoints();
      },

      setLanguage: (lang) => set({ language: lang }),

      setTeamName: (teamId, name) =>
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, name } : t,
          ) as [Team, Team],
        })),
      teams: INITIAL_TEAMS,

      updateScore: (teamId, points) =>
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, score: t.score + points } : t,
          ) as [Team, Team],
        })),

      useLifeline: (teamId, type) =>
        set((state) => ({
          lifelineActive: { teamId, type },
          teams: state.teams.map((t) => {
            if (t.id !== teamId) return t;
            if (type === "abcd") return { ...t, hasLifelineABCD: false };
            if (type === "phone") return { ...t, hasLifelinePhone: false };
            if (type === "steal") return { ...t, hasLifelineSteal: false };
            return t;
          }) as [Team, Team],
        })),
    }),
    {
      name: "game-tournament-storage-v3",
      partialize: (state) => ({
        awardedBingos: state.awardedBingos,
        categories: state.categories,
        doublePointQuestions: state.doublePointQuestions,
        language: state.language,
        teams: state.teams,
      }),
    },
  ),
);
