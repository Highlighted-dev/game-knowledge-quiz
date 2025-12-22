"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, Phone, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function QuestionModal() {
  const {
    activeQuestion,
    activeCategory,
    closeQuestion,
    updateScore,
    markQuestionAnswered,
    teams,
    lifelineActive,
    useLifeline,
    clearLifeline,
    language,
    setLanguage,
    isDoublePoints,
  } = useGameStore();
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (activeQuestion) {
      setIsRevealed(false);
    }
  }, [activeQuestion]);

  if (!activeQuestion) return null;

  const isDouble = isDoublePoints(activeQuestion.id);
  const effectivePoints = isDouble
    ? activeQuestion.points * 2
    : activeQuestion.points;

  const handleResolve = (teamId: string | null) => {
    if (teamId) {
      updateScore(teamId, effectivePoints);
    }
    if (activeCategory) {
      markQuestionAnswered(activeCategory, activeQuestion.id, teamId);
    }
    clearLifeline();
    closeQuestion();
  };

  const showOptions = lifelineActive?.type === "abcd";
  const showPhoneHint = lifelineActive?.type === "phone";
  const showStealHint = lifelineActive?.type === "steal";

  const t = {
    abcdUsed: language === "pl" ? "50/50 użyte" : "50/50 used",
    noPoints: language === "pl" ? "Brak Punktów" : "No Points",
    phoneHint:
      language === "pl"
        ? "Drużyna może teraz zadzwonić do przyjaciela!"
        : "Team can now call a friend!",
    phoneTimer:
      language === "pl"
        ? "Host: Daj 30 sekund na rozmowę."
        : "Host: Give 30 seconds for the call.",
    phoneUsed: language === "pl" ? "Telefon użyty" : "Phone used",
    showAnswer: language === "pl" ? "Pokaż Odpowiedź" : "Reveal Answer",
    stealHint:
      language === "pl"
        ? "Drużyna może przejąć pytanie!"
        : "Team can steal this question!",
    stealUsed: language === "pl" ? "Kradzież użyta" : "Steal used",
  };

  return (
    <Dialog
      onOpenChange={(open) => !open && closeQuestion()}
      open={!!activeQuestion}
    >
      <DialogContent
        className="max-w-4xl max-h-[90vh] bg-black border border-white/10 shadow-2xl p-0 gap-0 text-white sm:rounded-xl overflow-hidden flex flex-col"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{activeCategory} Question</DialogTitle>

        <div className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-zinc-950 flex-shrink-0">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "text-xs font-mono uppercase flex items-center gap-2",
                isDouble ? "text-yellow-400" : "text-zinc-500",
              )}
            >
              {effectivePoints} PTS
              {isDouble && (
                <span className="bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  2x
                </span>
              )}
            </span>

            <div className="flex gap-2">
              {teams.map((team) => (
                <div className="flex gap-1" key={team.id}>
                  <button
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center text-xs transition-all",
                      team.id === "team1"
                        ? "bg-blue-900/50 hover:bg-blue-800"
                        : "bg-red-900/50 hover:bg-red-800",
                      (!team.hasLifelineABCD || lifelineActive !== null) &&
                        "opacity-30 cursor-not-allowed",
                    )}
                    disabled={!team.hasLifelineABCD || lifelineActive !== null}
                    onClick={() =>
                      team.hasLifelineABCD && useLifeline(team.id, "abcd")
                    }
                    title={`${team.name} - 50/50`}
                  >
                    <Sparkles className="h-3 w-3" />
                  </button>
                  <button
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center text-xs transition-all",
                      team.id === "team1"
                        ? "bg-blue-900/50 hover:bg-blue-800"
                        : "bg-red-900/50 hover:bg-red-800",
                      (!team.hasLifelinePhone || lifelineActive !== null) &&
                        "opacity-30 cursor-not-allowed",
                    )}
                    disabled={!team.hasLifelinePhone || lifelineActive !== null}
                    onClick={() =>
                      team.hasLifelinePhone && useLifeline(team.id, "phone")
                    }
                    title={`${team.name} - Phone`}
                  >
                    <Phone className="h-3 w-3" />
                  </button>
                  <button
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center text-xs transition-all",
                      team.id === "team1"
                        ? "bg-blue-900/50 hover:bg-blue-800"
                        : "bg-red-900/50 hover:bg-red-800",
                      (!team.hasLifelineSteal || lifelineActive !== null) &&
                        "opacity-30 cursor-not-allowed",
                    )}
                    disabled={!team.hasLifelineSteal || lifelineActive !== null}
                    onClick={() =>
                      team.hasLifelineSteal && useLifeline(team.id, "steal")
                    }
                    title={`${team.name} - Steal`}
                  >
                    <Zap className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-xs"
              onClick={() => setLanguage(language === "pl" ? "en" : "pl")}
              title={
                language === "pl" ? "Switch to English" : "Przełącz na Polski"
              }
            >
              <Globe className="h-4 w-4" /> {language.toUpperCase()}
            </button>
            <button
              className="text-zinc-500 hover:text-white transition-colors"
              onClick={closeQuestion}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-12 flex flex-col items-center justify-start overflow-y-auto flex-1 min-h-0">
          {activeQuestion.type === "IMAGE" && activeQuestion.mediaUrl && (
            <div className="mb-6 relative w-full max-w-lg bg-zinc-900 border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                alt="Question"
                className="max-w-full max-h-[50vh] object-contain"
                src={activeQuestion.mediaUrl}
              />
            </div>
          )}

          {activeQuestion.type === "AUDIO" && activeQuestion.mediaUrl && (
            <div className="mb-6 p-4 bg-zinc-900 rounded-full border border-white/10">
              <audio
                className="w-full md:w-80"
                controls
                src={activeQuestion.mediaUrl}
              />
            </div>
          )}

          <h2 className="text-2xl md:text-4xl font-bold text-center tracking-tight leading-tight mb-8">
            {activeQuestion.question[language]}
          </h2>

          {lifelineActive && (
            <div
              className={cn(
                "mb-4 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2",
                lifelineActive.teamId === "team1"
                  ? "bg-blue-900/50 text-blue-300"
                  : "bg-red-900/50 text-red-300",
              )}
            >
              {lifelineActive.type === "abcd" && (
                <>
                  <Sparkles className="h-4 w-4" /> {t.abcdUsed}
                </>
              )}
              {lifelineActive.type === "phone" && (
                <>
                  <Phone className="h-4 w-4" /> {t.phoneUsed}
                </>
              )}
              {lifelineActive.type === "steal" && (
                <>
                  <Zap className="h-4 w-4" /> {t.stealUsed}
                </>
              )}
              <span className="opacity-60">
                ({teams.find((t) => t.id === lifelineActive.teamId)?.name})
              </span>
            </div>
          )}

          {showOptions && activeQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
              {activeQuestion.options[language].map((option, idx) => (
                <button
                  className={`p-3 rounded-md text-base font-medium text-left border transition-all
                    ${
                      isRevealed && option === activeQuestion.answer[language]
                        ? "bg-white text-black border-white"
                        : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                    }`}
                  key={idx}
                >
                  <span className="mr-2 text-zinc-500 font-mono">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {showPhoneHint && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center max-w-md">
              <Phone className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-zinc-400 text-sm">{t.phoneHint}</p>
              <p className="text-zinc-600 text-xs mt-1">{t.phoneTimer}</p>
            </div>
          )}

          {showStealHint && (
            <div className="bg-zinc-900 border border-orange-500/30 rounded-lg p-4 text-center max-w-md">
              <Zap className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-zinc-400 text-sm">{t.stealHint}</p>
            </div>
          )}

          <AnimatePresence>
            {isRevealed && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 px-6 py-2 bg-white/10 rounded-full border border-white/10"
                initial={{ opacity: 0, y: 10 }}
              >
                <span className="text-emerald-400 font-mono text-lg">
                  {activeQuestion.answer[language]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-white/10 bg-zinc-950 flex flex-col items-center flex-shrink-0">
          {!isRevealed ? (
            <Button
              className="h-10 px-6 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-sm"
              onClick={() => setIsRevealed(true)}
            >
              {t.showAnswer}
            </Button>
          ) : (
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <Button
                className="h-10 border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-blue-500"
                onClick={() => handleResolve("team1")}
                variant="outline"
              >
                <Check className="mr-1 h-4 w-4 text-blue-500" /> {teams[0].name}
              </Button>
              <Button
                className="h-10 text-zinc-500 hover:text-white hover:bg-zinc-900"
                onClick={() => handleResolve(null)}
                variant="ghost"
              >
                {t.noPoints}
              </Button>
              <Button
                className="h-10 border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-red-500"
                onClick={() => handleResolve("team2")}
                variant="outline"
              >
                <Check className="mr-1 h-4 w-4 text-red-500" /> {teams[1].name}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
