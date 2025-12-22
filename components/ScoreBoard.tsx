'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Sparkles, Phone, Zap } from 'lucide-react';

export default function ScoreBoard() {
  const { teams, setTeamName } = useGameStore();
  const [editing, setEditing] = useState<string | null>(null);

  const handleNameChange = (teamId: string, newName: string) => {
    setTeamName(teamId, newName);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center border-t border-white/10 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl flex items-center justify-between px-6 py-4">
        
        <div className="flex flex-col items-start gap-1">
           <div className="flex items-center gap-2">
             <span className="text-xs uppercase tracking-widest text-zinc-500">Team 01</span>
             <div className="flex gap-1">
               {teams[0].hasLifelineABCD && <Sparkles className="h-3 w-3 text-yellow-500" />}
               {teams[0].hasLifelinePhone && <Phone className="h-3 w-3 text-yellow-500" />}
               {teams[0].hasLifelineSteal && <Zap className="h-3 w-3 text-yellow-500" />}
             </div>
           </div>
           <div className="flex items-baseline gap-4">
                {editing === teams[0].id ? (
                    <Input 
                        value={teams[0].name} 
                        onChange={(e) => handleNameChange(teams[0].id, e.target.value)} 
                        className="w-auto min-w-[120px] h-8  border-none bg-transparent text-2xl font-bold text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        onBlur={() => setEditing(null)}
                        autoFocus
                    />
                ) : (
                    <h2 
                        className="text-2xl font-bold text-white cursor-pointer hover:text-zinc-300 transition-colors truncate max-w-[200px]"
                        onClick={() => setEditing(teams[0].id)}
                        title="Click to rename"
                    >
                        {teams[0].name}
                    </h2>
                )}
                <span className="text-4xl font-mono font-light tracking-tighter text-blue-500">
                    {teams[0].score.toString().padStart(4, '0')}
                </span>
           </div>
        </div>

        <div className="h-8 w-[1px] bg-zinc-800 hidden md:block" />

        <div className="flex flex-col items-end gap-1">
           <div className="flex items-center gap-2">
             <div className="flex gap-1">
               {teams[1].hasLifelineABCD && <Sparkles className="h-3 w-3 text-yellow-500" />}
               {teams[1].hasLifelinePhone && <Phone className="h-3 w-3 text-yellow-500" />}
               {teams[1].hasLifelineSteal && <Zap className="h-3 w-3 text-yellow-500" />}
             </div>
             <span className="text-xs uppercase tracking-widest text-zinc-500">Team 02</span>
           </div>
           <div className="flex items-baseline gap-4 flex-row-reverse">
                {editing === teams[1].id ? (
                    <Input 
                        value={teams[1].name} 
                        onChange={(e) => handleNameChange(teams[1].id, e.target.value)} 
                        className="w-auto min-w-[120px] h-8 p-0 border-none bg-transparent text-right text-2xl font-bold text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        onBlur={() => setEditing(null)}
                        autoFocus
                    />
                ) : (
                    <h2 
                        className="text-2xl font-bold text-white cursor-pointer hover:text-zinc-300 transition-colors truncate max-w-[200px]"
                        onClick={() => setEditing(teams[1].id)}
                        title="Click to rename"
                    >
                        {teams[1].name}
                    </h2>
                )}
                <span className="text-4xl font-mono font-light tracking-tighter text-red-500">
                    {teams[1].score.toString().padStart(4, '0')}
                </span>
           </div>
        </div>

      </div>
    </div>
  );
}
