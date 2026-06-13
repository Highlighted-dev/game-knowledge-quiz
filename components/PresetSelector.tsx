"use client";

import { Layers } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { loadCategoriesFromPreset } from "@/lib/mock-data";
import { getPresetById, PRESETS } from "@/lib/presets";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function PresetSelector() {
  const { activePresetId, loadPreset, language } = useGameStore();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activePreset = getPresetById(activePresetId);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedId(null);
    }
  };

  const handleLoad = async () => {
    if (!selectedId) return;

    const isReload = selectedId === activePresetId;
    const selectedPreset = getPresetById(selectedId);
    if (!selectedPreset) return;

    const msg = isReload
      ? language === "pl"
        ? `Czy na pewno chcesz przeładować preset "${selectedPreset.label}"? Wszystkie postępy gry zostaną zresetowane.`
        : `Are you sure you want to reload preset "${selectedPreset.label}"? All game progress will be reset.`
      : language === "pl"
        ? `Czy na pewno chcesz załadować preset "${selectedPreset.label}"? Plansza i wszystkie postępy gry (wyniki, odpowiedzi, bingo) zostaną zresetowane.`
        : `Are you sure you want to load preset "${selectedPreset.label}"? The board and all game progress (scores, answers, bingos) will be reset.`;

    if (!confirm(msg)) return;

    setLoading(true);
    try {
      const categories = await loadCategoriesFromPreset(selectedId);
      if (categories.length === 0) {
        alert(
          language === "pl"
            ? "Nie udało się załadować presetu."
            : "Failed to load preset.",
        );
        return;
      }
      loadPreset(selectedId, categories);
      setOpen(false);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-white/50 transition-colors shrink-0"
          variant="outline"
        >
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">
            {language === "pl" ? "Presety" : "Presets"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md flex max-h-[min(90dvh,calc(100%-2rem))] flex-col gap-3 overflow-hidden p-4 sm:p-6 max-sm:top-4 max-sm:translate-y-0">
        <DialogHeader className="shrink-0 pr-6">
          <DialogTitle>
            {language === "pl" ? "Wybierz preset" : "Select preset"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {language === "pl" ? "Aktywny preset: " : "Active preset: "}
            <span className="text-zinc-300 font-medium">
              {activePreset?.label ?? activePresetId}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain py-1 -mx-1 px-1">
          {PRESETS.map((preset) => {
            const isActive = preset.id === activePresetId;
            const isSelected = preset.id === selectedId;

            return (
              <button
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                  isSelected
                    ? "border-white/50 bg-white/5"
                    : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50",
                )}
                key={preset.id}
                onClick={() => setSelectedId(preset.id)}
                type="button"
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="font-medium text-sm">{preset.label}</span>
                  {isActive && (
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                      {language === "pl" ? "aktywny" : "active"}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-500 leading-snug break-words">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter className="shrink-0 border-t border-zinc-800 pt-3 sm:justify-end">
          <Button
            className="w-full bg-white text-black hover:bg-zinc-200 sm:w-auto"
            disabled={!selectedId || loading}
            onClick={handleLoad}
          >
            {loading
              ? language === "pl"
                ? "Ładowanie..."
                : "Loading..."
              : language === "pl"
                ? "Załaduj preset"
                : "Load preset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
