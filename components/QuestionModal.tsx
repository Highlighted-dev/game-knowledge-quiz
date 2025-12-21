'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Phone, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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
    setLanguage
  } = useGameStore();
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (activeQuestion) {
      setIsRevealed(false);
    }
  }, [activeQuestion]);

  if (!activeQuestion) return null;

  const handleResolve = (teamId: string | null) => {
    if (teamId) {
      updateScore(teamId, activeQuestion.points);
    }
    if (activeCategory) {
      markQuestionAnswered(activeCategory, activeQuestion.id, teamId);
    }
    clearLifeline();
    closeQuestion();
  };

  const showOptions = lifelineActive?.type === 'abcd';
  const showPhoneHint = lifelineActive?.type === 'phone';
  const showStealHint = lifelineActive?.type === 'steal';

  const t = {
    showAnswer: language === 'pl' ? 'Pokaż Odpowiedź' : 'Reveal Answer',
    noPoints: language === 'pl' ? 'Brak Punktów' : 'No Points',
    abcdUsed: language === 'pl' ? '50/50 użyte' : '50/50 used',
    phoneUsed: language === 'pl' ? 'Telefon użyty' : 'Phone used',
    phoneHint: language === 'pl' ? 'Drużyna może teraz zadzwonić do przyjaciela!' : 'Team can now call a friend!',
    phoneTimer: language === 'pl' ? 'Host: Daj 30 sekund na rozmowę.' : 'Host: Give 30 seconds for the call.',
    stealUsed: language === 'pl' ? 'Kradzież użyta' : 'Steal used',
    stealHint: language === 'pl' ? 'Drużyna może przejąć pytanie!' : 'Team can steal this question!',
  };

  return (
    <Dialog open={!!activeQuestion} onOpenChange={(open) => !open && closeQuestion()}>
      <DialogContent showCloseButton={false} className="max-w-4xl max-h-[90vh] bg-black border border-white/10 shadow-2xl p-0 gap-0 text-white sm:rounded-xl overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">
          {activeCategory} Question
        </DialogTitle>
        
          {/* Header Bar - Fixed */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-white/10 bg-zinc-950 flex-shrink-0">
             <div className="flex items-center gap-4">
               <span className="text-xs font-mono text-zinc-500 uppercase">{activeQuestion.points} PTS</span>
               
               {/* Compact Lifeline Buttons */}
               <div className="flex gap-2">
                 {teams.map((team) => (
                   <div key={team.id} className="flex gap-1">
                     <button
                       onClick={() => team.hasLifelineABCD && useLifeline(team.id, 'abcd')}
                       disabled={!team.hasLifelineABCD || lifelineActive !== null}
                       title={`${team.name} - 50/50`}
                       className={cn(
                         "w-7 h-7 rounded flex items-center justify-center text-xs transition-all",
                         team.id === 'team1' ? "bg-blue-900/50 hover:bg-blue-800" : "bg-red-900/50 hover:bg-red-800",
                         (!team.hasLifelineABCD || lifelineActive !== null) && "opacity-30 cursor-not-allowed"
                       )}
                     >
                       <Sparkles className="h-3 w-3" />
                     </button>
                     <button
                       onClick={() => team.hasLifelinePhone && useLifeline(team.id, 'phone')}
                       disabled={!team.hasLifelinePhone || lifelineActive !== null}
                       title={`${team.name} - Phone`}
                       className={cn(
                         "w-7 h-7 rounded flex items-center justify-center text-xs transition-all",
                         team.id === 'team1' ? "bg-blue-900/50 hover:bg-blue-800" : "bg-red-900/50 hover:bg-red-800",
                         (!team.hasLifelinePhone || lifelineActive !== null) && "opacity-30 cursor-not-allowed"
                       )}
                     >
                       <Phone className="h-3 w-3" />
                     </button>
                     <button
                       onClick={() => team.hasLifelineSteal && useLifeline(team.id, 'steal')}
                       disabled={!team.hasLifelineSteal || lifelineActive !== null}
                       title={`${team.name} - Steal`}
                       className={cn(
                         "w-7 h-7 rounded flex items-center justify-center text-xs transition-all",
                         team.id === 'team1' ? "bg-blue-900/50 hover:bg-blue-800" : "bg-red-900/50 hover:bg-red-800",
                         (!team.hasLifelineSteal || lifelineActive !== null) && "opacity-30 cursor-not-allowed"
                       )}
                     >
                       <Zap className="h-3 w-3" />
                     </button>
                   </div>
                 ))}
               </div>
             </div>
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => setLanguage(language === 'pl' ? 'en' : 'pl')}
                 className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1 text-xs"
                 title={language === 'pl' ? 'Switch to English' : 'Przełącz na Polski'}
               >
                 <Globe className="h-4 w-4" /> {language.toUpperCase()}
               </button>
               <button onClick={closeQuestion} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
               </button>
             </div>
          </div>

          {/* Content Area - Scrollable */}
          <div className="p-6 md:p-12 flex flex-col items-center justify-start overflow-y-auto flex-1 min-h-0">
             
             {activeQuestion.type === 'IMAGE' && activeQuestion.mediaUrl && (
               <div className="mb-6 relative w-full max-h-64 bg-zinc-900 border border-white/5 rounded-lg overflow-hidden">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={activeQuestion.mediaUrl} alt="Question" className="w-full h-full object-contain" />
               </div>
            )}
            
            {activeQuestion.type === 'AUDIO' && activeQuestion.mediaUrl && (
              <div className="mb-6 p-4 bg-zinc-900 rounded-full border border-white/10">
                 <audio controls className="w-full md:w-80" src={activeQuestion.mediaUrl} />
              </div>
            )}

            <h2 className="text-2xl md:text-4xl font-bold text-center tracking-tight leading-tight mb-8">
              {activeQuestion.question}
            </h2>

            {/* Lifeline Used Notification */}
            {lifelineActive && (
              <div className={cn(
                "mb-4 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2",
                lifelineActive.teamId === 'team1' ? "bg-blue-900/50 text-blue-300" : "bg-red-900/50 text-red-300"
              )}>
                {lifelineActive.type === 'abcd' && <><Sparkles className="h-4 w-4" /> {t.abcdUsed}</>}
                {lifelineActive.type === 'phone' && <><Phone className="h-4 w-4" /> {t.phoneUsed}</>}
                {lifelineActive.type === 'steal' && <><Zap className="h-4 w-4" /> {t.stealUsed}</>}
                <span className="opacity-60">({teams.find(t => t.id === lifelineActive.teamId)?.name})</span>
              </div>
            )}

            {/* ABCD Options */}
            {showOptions && activeQuestion.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mx-auto">
                {activeQuestion.options.map((option, idx) => (
                  <button key={idx} className={`p-3 rounded-md text-base font-medium text-left border transition-all
                    ${isRevealed && option === activeQuestion.answer 
                      ? 'bg-white text-black border-white' 
                      : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'}`}>
                    <span className="mr-2 text-zinc-500 font-mono">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Phone hint */}
            {showPhoneHint && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center max-w-md">
                <Phone className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-zinc-400 text-sm">{t.phoneHint}</p>
                <p className="text-zinc-600 text-xs mt-1">{t.phoneTimer}</p>
              </div>
            )}

            {/* Steal hint */}
            {showStealHint && (
              <div className="bg-zinc-900 border border-orange-500/30 rounded-lg p-4 text-center max-w-md">
                <Zap className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-zinc-400 text-sm">{t.stealHint}</p>
              </div>
            )}

            {/* Answer Reveal */}
            <AnimatePresence>
                {isRevealed && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 px-6 py-2 bg-white/10 rounded-full border border-white/10"
                    >
                        <span className="text-emerald-400 font-mono text-lg">{activeQuestion.answer}</span>
                    </motion.div>
                )}
            </AnimatePresence>

          </div>

          {/* Footer Actions - Fixed */}
          <div className="p-4 border-t border-white/10 bg-zinc-950 flex flex-col items-center flex-shrink-0">
            {!isRevealed ? (
                 <Button onClick={() => setIsRevealed(true)} className="h-10 px-6 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-sm">
                   {t.showAnswer}
                 </Button>
               ) : (
                 <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                   <Button onClick={() => handleResolve('team1')} variant="outline" className="h-10 border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-blue-500">
                     <Check className="mr-1 h-4 w-4 text-blue-500" /> {teams[0].name}
                   </Button>
                   <Button onClick={() => handleResolve(null)} variant="ghost" className="h-10 text-zinc-500 hover:text-white hover:bg-zinc-900">
                     {t.noPoints}
                   </Button>
                   <Button onClick={() => handleResolve('team2')} variant="outline" className="h-10 border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-red-500">
                     <Check className="mr-1 h-4 w-4 text-red-500" /> {teams[1].name}
                   </Button>
                 </div>
               )}
          </div>

      </DialogContent>
    </Dialog>
  );
}
