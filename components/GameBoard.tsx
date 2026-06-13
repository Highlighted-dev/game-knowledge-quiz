"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, RotateCcw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { IconBingo } from "@/components/icons";
import PresetSelector from "@/components/PresetSelector";
import { getAwardedBingoCells } from "@/lib/bingo";
import { loadCategoriesFromPreset } from "@/lib/mock-data";
import { getPresetById } from "@/lib/presets";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function GameBoard() {
  const {
    categories,
    loadCategories,
    activePresetId,
    openQuestion,
    teams,
    resetGame,
    checkAndAwardBingo,
    bingoNotification,
    clearBingoNotification,
    language,
    setLanguage,
    isDoublePoints,
    changeQuestionResult,
    awardedBingos,
  } = useGameStore();

  const bingoCells = useMemo(
    () => getAwardedBingoCells(categories, awardedBingos),
    [categories, awardedBingos],
  );

  useEffect(() => {
    const presetId = useGameStore.getState().activePresetId;
    loadCategoriesFromPreset(presetId).then((cats) => {
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
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            
            <motion.div
              animate={{ scaleY: 1, opacity: 1 }}
              className="relative w-full bg-zinc-950/90 border-y-2 border-yellow-500/40 py-12 md:py-16 flex flex-col items-center justify-center shadow-[0_0_100px_rgba(234,179,8,0.15)] backdrop-blur-xl"
              initial={{ scaleY: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
              
              <div className="relative z-10 flex items-center gap-6 md:gap-20">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  className="text-yellow-500 hidden md:block drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <IconBingo className="w-24 h-24 md:w-32 md:h-32" />
                </motion.div>
                
                <div className="flex flex-col items-center">
                  <h2 className="text-6xl md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600 tracking-[0.2em] uppercase leading-none drop-shadow-2xl mb-4 translate-x-3">
                    BINGO
                  </h2>
                  <p className="text-lg md:text-3xl text-yellow-400 font-mono uppercase tracking-[0.4em] font-bold drop-shadow-md">
                    {bingoNotification.replace("BINGO! ", "")}
                  </p>
                </div>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  className="text-yellow-500 hidden md:block drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <IconBingo className="w-24 h-24 md:w-32 md:h-32" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-wrap justify-end items-center gap-2 px-2">
        <span className="absolute left-2 text-[10px] uppercase tracking-widest text-zinc-600 hidden md:inline">
          {getPresetById(activePresetId)?.label ?? activePresetId}
        </span>
        <PresetSelector />
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
                const isBingoCell = bingoCells.has(q.id);

                return (
                  <button
                    className={cn(
                      "group relative h-14 md:h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-200 border",
                      q.isAnswered
                        ? cn(
                            "cursor-pointer",
                            isTeam1 &&
                              "bg-blue-950/50 border-blue-500/50 hover:border-blue-400",
                            isTeam2 &&
                              "bg-red-950/50 border-red-500/50 hover:border-red-400",
                            !q.answeredBy &&
                              "bg-zinc-900/30 border-dashed border-zinc-800 hover:border-zinc-600",
                            isBingoCell &&
                              isTeam1 &&
                              "border-blue-400",
                            isBingoCell &&
                              isTeam2 &&
                              "border-red-400",
                            isBingoCell &&
                              !q.answeredBy &&
                              "border-solid border-zinc-500",
                          )
                        : "bg-black border-zinc-800 hover:border-white/50 text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer",
                    )}
                    key={q.id}
                    onClick={() => {
                      if (!q.isAnswered) {
                        openQuestion(cat.id, q.id);
                      } else {
                        // Cycle through: team1 -> team2 -> null -> team1
                        const oldAnsweredBy = q.answeredBy;
                        let newAnsweredBy: string | null;
                        if (oldAnsweredBy === "team1") {
                          newAnsweredBy = "team2";
                        } else if (oldAnsweredBy === "team2") {
                          newAnsweredBy = null;
                        } else {
                          newAnsweredBy = "team1";
                        }
                        changeQuestionResult(
                          cat.id,
                          q.id,
                          newAnsweredBy,
                          oldAnsweredBy ?? null,
                          q.points,
                        );
                      }
                    }}
                    title={
                      isBingoCell
                        ? language === "pl"
                          ? "Część binga"
                          : "Part of a bingo"
                        : undefined
                    }
                  >
                    {isBingoCell && (
                      <span className="absolute top-1 right-1 text-[10px] font-medium leading-none text-zinc-600">
                        B
                      </span>
                    )}
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
