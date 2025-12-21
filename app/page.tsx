import GameBoard from '@/components/GameBoard';
import ScoreBoard from '@/components/ScoreBoard';
import QuestionModal from '@/components/QuestionModal';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col items-center">
        <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0)) pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto pt-16 pb-32 px-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-center mb-16 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Wielki Turniej Wiedzy O Grach
        </h1>
        
        <GameBoard />
      </div>

      <ScoreBoard />
      <QuestionModal />
    </main>
  );
}
