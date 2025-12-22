"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { loadCategoriesFromFile } from "@/lib/mock-data";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function GameBoard() {
  const {
    categories,
    loadCategories,
    openQuestion,
    teams,
    resetGame,
    checkAndAwardBingo,
    bingoNotification,
    clearBingoNotification,
    language,
    setLanguage,
    isDoublePoints,
  } = useGameStore();

  useEffect(() => {
    loadCategoriesFromFile().then((cats) => {
      if (cats.length > 0) {
        loadCategories(cats);
      }
    });
  }, [loadCategories]);

  // Check for bingo after categories change
  useEffect(() => {
    checkAndAwardBingo();
  }, [categories, checkAndAwardBingo]);

  // Auto-clear bingo notification
  useEffect(() => {
    if (bingoNotification) {
      const timer = setTimeout(() => clearBingoNotification(), 4000);
      return () => clearTimeout(timer);
    }
  }, [bingoNotification, clearBingoNotification]);

  const getTeamInfo = (teamId: string | null | undefined) => {
    if (!teamId) return null;
    return teams.find((t) => t.id === teamId);
  };

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-zinc-500">
          {language === "pl"
            ? "Ładowanie kategorii..."
            : "Loading categories..."}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <AnimatePresence>
        {bingoNotification && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            exit={{ filter: "blur(10px)", opacity: 0, scale: 1.1 }}
            initial={{ opacity: 0, scale: 0.9 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              animate={{ y: 0 }}
              className="relative bg-zinc-900/90 border border-yellow-500/30 p-12 rounded-3xl flex flex-col items-center shadow-[0_0_100px_rgba(234,179,8,0.2)] text-center max-w-2xl mx-4"
              initial={{ y: 20 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                className="text-6xl mb-6"
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                🏆
              </motion.div>
              <h2 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase italic">
                BINGO!
              </h2>
              <div className="h-1 w-32 bg-yellow-500 rounded-full mb-6" />
              <p className="text-2xl font-medium text-yellow-400">
                {bingoNotification.replace("BINGO! ", "")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-2 px-2">
        <Button
          className="gap-2 bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-white/50 transition-colors"
          onClick={() => setLanguage(language === "pl" ? "en" : "pl")}
          title={language === "pl" ? "Switch to English" : "Przełącz na Polski"}
          variant="outline"
        >
          <Globe className="h-4 w-4" /> {language.toUpperCase()}
        </Button>
        <Button
          className="gap-2 bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500/50 transition-colors"
          onClick={() => {
            const msg =
              language === "pl"
                ? "Czy na pewno chcesz zresetować grę?"
                : "Are you sure you want to reset the game?";
            if (confirm(msg)) {
              resetGame();
            }
          }}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4">
        {categories.map((cat) => (
          <div className="flex flex-col gap-4" key={cat.id}>
            <div className="h-12 flex items-center justify-center text-center border-b border-white/10 mx-4 md:mx-0">
              <h3 className="font-medium text-xs text-zinc-400 uppercase tracking-widest leading-tight">
                {cat.name}
              </h3>
            </div>

            <div className="grid grid-cols-6 md:flex md:flex-col gap-3 px-2 md:px-0">
              {cat.questions.map((q) => {
                const answeredTeam = getTeamInfo(q.answeredBy);
                const isTeam1 = q.answeredBy === "team1";
                const isTeam2 = q.answeredBy === "team2";
                const isDouble = isDoublePoints(q.id);

                return (
                  <button
                    className={cn(
                      "group relative h-14 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-200 border",
                      q.isAnswered
                        ? cn(
                            "cursor-default",
                            isTeam1 && "bg-blue-950/50 border-blue-500/50",
                            isTeam2 && "bg-red-950/50 border-red-500/50",
                            !q.answeredBy &&
                              "bg-zinc-900/30 border-dashed border-zinc-800",
                          )
                        : "bg-black border-zinc-800 hover:border-white/50 text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer",
                    )}
                    disabled={q.isAnswered}
                    key={q.id}
                    onClick={() => !q.isAnswered && openQuestion(cat.id, q.id)}
                  >
                    {q.isAnswered ? (
                      q.answeredBy ? (
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={cn(
                              "text-xs font-medium uppercase tracking-wider",
                              isTeam1 && "text-blue-400",
                              isTeam2 && "text-red-400",
                            )}
                          >
                            {answeredTeam?.name}
                          </span>
                          <span
                            className={cn(
                              "text-lg font-bold",
                              isTeam1 && "text-blue-300",
                              isTeam2 && "text-red-300",
                            )}
                          >
                            +{isDouble ? q.points * 2 : q.points}
                            {isDouble && (
                              <span className="text-yellow-400 text-xs ml-1">
                                2x
                              </span>
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-700 text-xs">—</span>
                      )
                    ) : (
                      <span className="font-mono text-xl md:text-2xl font-bold tracking-tighter group-hover:scale-110 transition-transform">
                        {q.points}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
