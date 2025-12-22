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
  resetGame: () => void;
  loadCategories: (categories: Category[]) => void;
  useLifeline: (teamId: string, type: "abcd" | "phone" | "steal") => void;
  clearLifeline: () => void;
  checkAndAwardBingo: () => void;
  setLanguage: (lang: "pl" | "en") => void;
  clearBingoNotification: () => void;
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

      checkAndAwardBingo: () => {
        const state = get();
        const { categories, awardedBingos, teams } = state;
        if (categories.length === 0) return;

        // Check horizontal (all questions in a category by same team)
        for (let catIdx = 0; catIdx < categories.length; catIdx++) {
          const cat = categories[catIdx];
          const answers = cat.questions.map((q) => q.answeredBy);
          const allAnswered = answers.every(
            (a) => a !== undefined && a !== null,
          );
          if (allAnswered) {
            const firstAnswer = answers[0];
            const allSameTeam = answers.every((a) => a === firstAnswer);
            const bingoKey = `h-${catIdx}-${firstAnswer}`;
            if (
              allSameTeam &&
              firstAnswer &&
              !awardedBingos.includes(bingoKey)
            ) {
              const team = teams.find((t) => t.id === firstAnswer);
              set((s) => ({
                awardedBingos: [...s.awardedBingos, bingoKey],
                bingoNotification: `BINGO! ${team?.name} +600 (${cat.name})`,
                teams: s.teams.map((t) =>
                  t.id === firstAnswer ? { ...t, score: t.score + 600 } : t,
                ) as [Team, Team],
              }));
              return;
            }
          }
        }

        // Check vertical (same row across all categories by same team)
        for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
          const rowAnswers = categories.map(
            (cat) => cat.questions[rowIdx]?.answeredBy,
          );
          const allAnswered = rowAnswers.every(
            (a) => a !== undefined && a !== null,
          );
          if (allAnswered) {
            const firstAnswer = rowAnswers[0];
            const allSameTeam = rowAnswers.every((a) => a === firstAnswer);
            const bingoKey = `v-${rowIdx}-${firstAnswer}`;
            if (
              allSameTeam &&
              firstAnswer &&
              !awardedBingos.includes(bingoKey)
            ) {
              const team = teams.find((t) => t.id === firstAnswer);
              const points = [100, 200, 300, 400, 500, 600][rowIdx];
              set((s) => ({
                awardedBingos: [...s.awardedBingos, bingoKey],
                bingoNotification: `BINGO! ${team?.name} +600 (${points}pkt rząd)`,
                teams: s.teams.map((t) =>
                  t.id === firstAnswer ? { ...t, score: t.score + 600 } : t,
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

      resetGame: () =>
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
          lifelineActive: null,
          teams: INITIAL_TEAMS,
        }),

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
      name: "game-tournament-storage-v2",
      partialize: (state) => ({
        awardedBingos: state.awardedBingos,
        categories: state.categories,
        language: state.language,
        teams: state.teams,
      }),
    },
  ),
);
