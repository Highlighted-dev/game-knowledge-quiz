import GameBoard from "@/components/GameBoard";
import HeroTitle from "@/components/HeroTitle";
import QuestionModal from "@/components/QuestionModal";
import ScoreBoard from "@/components/ScoreBoard";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black text-white flex flex-col items-center">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0)) pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto pt-8 pb-48 md:pb-32 px-6 flex flex-col items-center">
        <HeroTitle />

        <GameBoard />
      </div>

      <ScoreBoard />
      <QuestionModal />
    </main>
  );
}
