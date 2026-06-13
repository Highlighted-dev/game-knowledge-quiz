"use client";

import { t } from "@/lib/i18n";
import { useGameStore } from "@/lib/store";

export default function HeroTitle() {
  const language = useGameStore((state) => state.language);

  return (
    <div className="flex flex-col items-center mb-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
      <span className="font-mono text-blue-500 tracking-[0.5em] text-sm md:text-base uppercase mb-4 font-bold">
        {t("hero.subtitle", language)}
      </span>
      <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 drop-shadow-sm">
        {t("hero.title", language)}
      </h1>
      <div className="mt-4 h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
    </div>
  );
}
