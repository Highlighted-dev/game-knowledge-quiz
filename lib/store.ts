import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestionType = 'OPEN' | 'ABCD' | 'IMAGE' | 'AUDIO';

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
  lifelineActive: { teamId: string; type: 'abcd' | 'phone' | 'steal' } | null;
  awardedBingos: string[];
  language: 'pl' | 'en';
  bingoNotification: string | null;
  
  // Actions
  setTeamName: (teamId: string, name: string) => void;
  updateScore: (teamId: string, points: number) => void;
  openQuestion: (categoryId: string, questionId: string) => void;
  closeQuestion: () => void;
  markQuestionAnswered: (categoryId: string, questionId: string, answeredBy: string | null) => void;
  resetGame: () => void;
  loadCategories: (categories: Category[]) => void;
  useLifeline: (teamId: string, type: 'abcd' | 'phone' | 'steal') => void;
  clearLifeline: () => void;
  checkAndAwardBingo: () => void;
  setLanguage: (lang: 'pl' | 'en') => void;
  clearBingoNotification: () => void;
};

const INITIAL_TEAMS: [Team, Team] = [
  { id: 'team1', name: 'Drużyna 1', score: 0, hasLifelineABCD: true, hasLifelinePhone: true, hasLifelineSteal: true },
  { id: 'team2', name: 'Drużyna 2', score: 0, hasLifelineABCD: true, hasLifelinePhone: true, hasLifelineSteal: true },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      teams: INITIAL_TEAMS,
      categories: [],
      activeQuestion: null,
      activeCategory: null,
      lifelineActive: null,
      awardedBingos: [],
      language: 'pl',
      bingoNotification: null,

      setTeamName: (teamId, name) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? { ...t, name } : t)) as [Team, Team],
        })),

      updateScore: (teamId, points) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? { ...t, score: t.score + points } : t)) as [Team, Team],
        })),

      openQuestion: (categoryId, questionId) => 
        set((state) => {
            const category = state.categories.find(c => c.id === categoryId);
            const question = category?.questions.find(q => q.id === questionId);
            return { activeQuestion: question || null, activeCategory: categoryId, lifelineActive: null };
        }),

      closeQuestion: () => set({ activeQuestion: null, activeCategory: null, lifelineActive: null }),

      markQuestionAnswered: (categoryId, questionId, answeredBy) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === categoryId
              ? {
                  ...c,
                  questions: c.questions.map((q) =>
                    q.id === questionId ? { ...q, isAnswered: true, answeredBy } : q
                  ),
                }
              : c
          ),
        })),
      
      useLifeline: (teamId, type) =>
        set((state) => ({
          teams: state.teams.map((t) => {
            if (t.id !== teamId) return t;
            if (type === 'abcd') return { ...t, hasLifelineABCD: false };
            if (type === 'phone') return { ...t, hasLifelinePhone: false };
            if (type === 'steal') return { ...t, hasLifelineSteal: false };
            return t;
          }) as [Team, Team],
          lifelineActive: { teamId, type },
        })),
      
      clearLifeline: () => set({ lifelineActive: null }),
      
      setLanguage: (lang) => set({ language: lang }),
      
      clearBingoNotification: () => set({ bingoNotification: null }),
      
      checkAndAwardBingo: () => {
        const state = get();
        const { categories, awardedBingos, teams } = state;
        if (categories.length === 0) return;
        
        // Check horizontal (all questions in a category by same team)
        for (let catIdx = 0; catIdx < categories.length; catIdx++) {
          const cat = categories[catIdx];
          const answers = cat.questions.map(q => q.answeredBy);
          const allAnswered = answers.every(a => a !== undefined && a !== null);
          if (allAnswered) {
            const firstAnswer = answers[0];
            const allSameTeam = answers.every(a => a === firstAnswer);
            const bingoKey = `h-${catIdx}-${firstAnswer}`;
            if (allSameTeam && firstAnswer && !awardedBingos.includes(bingoKey)) {
              const team = teams.find(t => t.id === firstAnswer);
              set((s) => ({ 
                awardedBingos: [...s.awardedBingos, bingoKey],
                teams: s.teams.map(t => t.id === firstAnswer ? { ...t, score: t.score + 500 } : t) as [Team, Team],
                bingoNotification: `BINGO! ${team?.name} +500 (${cat.name})`
              }));
              return;
            }
          }
        }
        
        // Check vertical (same row across all categories by same team)
        for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
          const rowAnswers = categories.map(cat => cat.questions[rowIdx]?.answeredBy);
          const allAnswered = rowAnswers.every(a => a !== undefined && a !== null);
          if (allAnswered) {
            const firstAnswer = rowAnswers[0];
            const allSameTeam = rowAnswers.every(a => a === firstAnswer);
            const bingoKey = `v-${rowIdx}-${firstAnswer}`;
            if (allSameTeam && firstAnswer && !awardedBingos.includes(bingoKey)) {
              const team = teams.find(t => t.id === firstAnswer);
              const points = [100, 200, 300, 400, 500][rowIdx];
              set((s) => ({ 
                awardedBingos: [...s.awardedBingos, bingoKey],
                teams: s.teams.map(t => t.id === firstAnswer ? { ...t, score: t.score + 500 } : t) as [Team, Team],
                bingoNotification: `BINGO! ${team?.name} +500 (${points}pkt rząd)`
              }));
              return;
            }
          }
        }
      },
        
      resetGame: () => set({ 
        teams: INITIAL_TEAMS, 
        categories: get().categories.map(c => ({
          ...c,
          questions: c.questions.map(q => ({ ...q, isAnswered: false, answeredBy: null }))
        })),
        activeQuestion: null,
        lifelineActive: null,
        awardedBingos: [],
        bingoNotification: null
      }),
      
      loadCategories: (newCategories) => {
        const state = get();
        // Merge: keep answered state from saved categories if IDs match
        const mergedCategories = newCategories.map(newCat => {
          const savedCat = state.categories.find(c => c.id === newCat.id);
          if (!savedCat) return newCat;
          
          return {
            ...newCat,
            questions: newCat.questions.map(newQ => {
              const savedQ = savedCat.questions.find(q => q.id === newQ.id);
              if (!savedQ) return newQ;
              return { ...newQ, isAnswered: savedQ.isAnswered, answeredBy: savedQ.answeredBy };
            })
          };
        });
        set({ categories: mergedCategories });
      },
    }),
    {
      name: 'game-tournament-storage-v2',
      partialize: (state) => ({ 
        teams: state.teams,
        categories: state.categories,
        awardedBingos: state.awardedBingos,
        language: state.language
      }),
    }
  )
);
