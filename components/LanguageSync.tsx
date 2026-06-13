"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";

export default function LanguageSync() {
  const language = useGameStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
