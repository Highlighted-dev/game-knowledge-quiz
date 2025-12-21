'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { loadCategoriesFromFile } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { RotateCcw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    setLanguage
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
    return teams.find(t => t.id === teamId);
  };

  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-zinc-500">{language === 'pl' ? 'Ładowanie kategorii...' : 'Loading categories...'}</div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Bingo Notification - Subtle Toast */}
      {bingoNotification && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-yellow-500/50 text-yellow-400 font-bold px-6 py-3 rounded-lg shadow-lg animate-pulse">
          🎯 {bingoNotification}
        </div>
      )}
      
      {/* Header Actions */}
      <div className="flex justify-end gap-2 px-2">
        <Button 
          variant="outline" 
          onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
          className="gap-2 bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-white/50 transition-colors"
          title={language === 'pl' ? 'Switch to English' : 'Przełącz na Polski'}
        >
          <Globe className="h-4 w-4" /> {language.toUpperCase()}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            const msg = language === 'pl' ? 'Czy na pewno chcesz zresetować grę?' : 'Are you sure you want to reset the game?';
            if (confirm(msg)) {
              resetGame();
            }
          }}
          className="gap-2 bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-red-500/50 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-4">
            {/* Category Header */}
            <div className="h-16 flex items-center justify-center text-center border-b border-white/10 mx-4 md:mx-0">
               <h3 className="font-medium text-sm text-zinc-400 uppercase tracking-widest">{cat.name}</h3>
            </div>

            {/* Questions Column */}
            <div className="grid grid-cols-5 md:flex md:flex-col gap-3 px-2 md:px-0">
                {cat.questions.map((q) => {
                    const answeredTeam = getTeamInfo(q.answeredBy);
                    const isTeam1 = q.answeredBy === 'team1';
                    const isTeam2 = q.answeredBy === 'team2';
                    
                    return (
                        <button
                            key={q.id}
                            onClick={() => !q.isAnswered && openQuestion(cat.id, q.id)}
                            disabled={q.isAnswered}
                            className={cn(
                            "group relative h-16 md:h-24 rounded-lg flex flex-col items-center justify-center transition-all duration-200 border",
                            q.isAnswered 
                                ? cn(
                                    "cursor-default",
                                    isTeam1 && "bg-blue-950/50 border-blue-500/50",
                                    isTeam2 && "bg-red-950/50 border-red-500/50",
                                    !q.answeredBy && "bg-zinc-900/30 border-dashed border-zinc-800"
                                  )
                                : "bg-black border-zinc-800 hover:border-white/50 text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer"
                            )}
                        >
                            {q.isAnswered ? (
                                q.answeredBy ? (
                                    <div className="flex flex-col items-center gap-1">
                                        <span className={cn(
                                            "text-xs font-medium uppercase tracking-wider",
                                            isTeam1 && "text-blue-400",
                                            isTeam2 && "text-red-400"
                                        )}>
                                            {answeredTeam?.name}
                                        </span>
                                        <span className={cn(
                                            "text-lg font-bold",
                                            isTeam1 && "text-blue-300",
                                            isTeam2 && "text-red-300"
                                        )}>
                                            +{q.points}
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
