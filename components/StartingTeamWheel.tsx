"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type StartingTeamWheelProps = {
  open: boolean;
  onClose: () => void;
};

type SpinOutcome = {
  teamId: "team1" | "team2";
  landingAngle: number;
};

function rollSpinOutcome(): SpinOutcome {
  const roll = Math.floor(Math.random() * 100) + 1;

  if (roll <= 50) {
    const landingAngle = (270 + ((roll - 0.5) / 50) * 180) % 360;
    return { teamId: "team2", landingAngle };
  }

  const landingAngle = (90 + ((roll - 50.5) / 50) * 180) % 360;
  return { teamId: "team1", landingAngle };
}

function getRotationForLanding(
  landingAngle: number,
  currentRotation: number,
): number {
  const fullSpins = 5 + Math.floor(Math.random() * 4);
  const targetMod = (360 - landingAngle) % 360;
  const currentMod = currentRotation % 360;
  const delta = (targetMod - currentMod + 360) % 360;
  return currentRotation + fullSpins * 360 + delta;
}

export default function StartingTeamWheel({
  open,
  onClose,
}: StartingTeamWheelProps) {
  const { teams, language, setStartingTeam } = useGameStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winnerId, setWinnerId] = useState<"team1" | "team2" | null>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!open) {
      setIsSpinning(false);
      setWinnerId(null);
      setRotation(0);
      rotationRef.current = 0;
    }
  }, [open]);

  const handleSpin = () => {
    if (isSpinning) return;

    const { teamId: pickedTeam, landingAngle } = rollSpinOutcome();
    const nextRotation = getRotationForLanding(
      landingAngle,
      rotationRef.current,
    );

    setIsSpinning(true);
    setWinnerId(null);
    setRotation(nextRotation);
    rotationRef.current = nextRotation;

    window.setTimeout(() => {
      setStartingTeam(pickedTeam);
      setWinnerId(pickedTeam);
      setIsSpinning(false);
    }, 3800);
  };

  const winner = winnerId ? teams.find((team) => team.id === winnerId) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <div className="absolute inset-0 min-h-full bg-black/70 backdrop-blur-md" />

          <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]">
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              className="relative flex w-full max-w-sm flex-col items-center gap-4 sm:gap-6 md:gap-8 my-auto"
              exit={{ scale: 0.95, opacity: 0 }}
              initial={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold uppercase tracking-wide sm:tracking-widest text-white text-center leading-tight px-1">
                {t("wheel.title", language)}
              </h2>

              <div className="relative flex w-full max-w-[min(72vw,18rem)] items-center justify-center aspect-square">
                <div className="absolute -top-2 sm:-top-3 z-20 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] sm:border-l-[14px] sm:border-r-[14px] sm:border-t-[22px] border-l-transparent border-r-transparent border-t-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />

                <motion.div
                  animate={{ rotate: rotation }}
                  className="relative h-full w-full rounded-full overflow-hidden border-[3px] sm:border-4 border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.1)]"
                  transition={{
                    duration: 3.8,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                >
                  <div className="absolute inset-0 bg-[#ef4444]" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#3b82f6]" />
                  <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-white/25 z-10" />

                  <div className="absolute inset-x-0 top-0 h-1/2 flex items-center justify-center px-2">
                    <span className="max-w-[75%] truncate text-center text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {teams[1].name}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 flex items-center justify-center px-2">
                    <span className="max-w-[75%] truncate text-center text-xs sm:text-sm font-bold text-white drop-shadow-md">
                      {teams[0].name}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-zinc-950 border-2 border-white/30 shadow-inner z-20" />
                  </div>
                </motion.div>
              </div>

              {winner && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "text-base sm:text-xl md:text-2xl font-bold text-center px-2 leading-snug max-w-full break-words",
                    winner.id === "team1" ? "text-blue-400" : "text-red-400",
                  )}
                  initial={{ opacity: 0, y: 8 }}
                >
                  {t("wheel.goesFirst", language, { name: winner.name })}
                </motion.p>
              )}

              <div className="flex w-full justify-center px-2">
                {!winner ? (
                  <Button
                    className="min-w-[120px] sm:min-w-[140px] bg-white text-black hover:bg-zinc-200"
                    disabled={isSpinning}
                    onClick={handleSpin}
                    size="default"
                  >
                    {isSpinning
                      ? t("wheel.spinning", language)
                      : t("wheel.spin", language)}
                  </Button>
                ) : (
                  <Button
                    className="min-w-[120px] sm:min-w-[140px] bg-white text-black hover:bg-zinc-200"
                    onClick={onClose}
                    size="default"
                  >
                    {t("wheel.continue", language)}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
