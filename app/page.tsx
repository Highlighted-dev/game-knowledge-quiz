import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';
import QuestionModal from '@/components/QuestionModal';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col items-center">
        <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0)) pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto pt-8 pb-16 px-6 flex flex-col items-center">
        <div className="flex flex-col items-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
          <span className="font-mono text-blue-500 tracking-[0.5em] text-sm md:text-base uppercase mb-4 font-bold">
            Wielki Turniej
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 drop-shadow-sm">
            WIEDZY O GRACH
          </h1>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
        </div>
        
        <GameBoard />
      </div>

      <ScoreBoard />
      <QuestionModal />
    </main>
  );
}
