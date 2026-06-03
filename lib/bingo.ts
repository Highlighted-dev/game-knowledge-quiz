export const BINGO_RUN_LENGTH = 5;

type BingoQuestion = {
  id: string;
  isAnswered: boolean;
  answeredBy?: string | null;
};

type BingoCategory = {
  questions: BingoQuestion[];
};

export function countsForBingo(q: BingoQuestion, opposingTeamId: string): boolean {
  return q.isAnswered && q.answeredBy !== opposingTeamId;
}

/** At least `runLength` adjacent cells in array order (column top→bottom or row left→right). */
export function hasConsecutiveBingoRun(
  questions: BingoQuestion[],
  opposingTeamId: string,
  runLength = BINGO_RUN_LENGTH,
): boolean {
  return findConsecutiveBingoRunIndices(questions, opposingTeamId, runLength)
    .length >= runLength;
}

/** Indices of the first qualifying consecutive run (extends through longer streaks). */
export function findConsecutiveBingoRunIndices(
  questions: BingoQuestion[],
  opposingTeamId: string,
  runLength = BINGO_RUN_LENGTH,
): number[] {
  let streak = 0;
  let streakStart = 0;
  let result: number[] = [];

  for (let i = 0; i < questions.length; i++) {
    if (countsForBingo(questions[i], opposingTeamId)) {
      if (streak === 0) streakStart = i;
      streak++;
      if (streak >= runLength) {
        result = Array.from({ length: streak }, (_, k) => streakStart + k);
      }
    } else {
      if (result.length >= runLength) return result;
      streak = 0;
      result = [];
    }
  }

  return result.length >= runLength ? result : [];
}

/** questionId → teamId that earned bingo with that cell */
export function getAwardedBingoCells(
  categories: BingoCategory[],
  awardedBingos: string[],
): Map<string, string> {
  const cells = new Map<string, string>();

  for (const bingoKey of awardedBingos) {
    const parts = bingoKey.split("-");
    const type = parts[0];
    const idx = Number.parseInt(parts[1], 10);
    const teamId = parts[2];
    const opposingTeamId = teamId === "team1" ? "team2" : "team1";

    if (type === "h") {
      const cat = categories[idx];
      if (!cat) continue;
      const runIndices = findConsecutiveBingoRunIndices(
        cat.questions,
        opposingTeamId,
      );
      for (const qi of runIndices) {
        cells.set(cat.questions[qi].id, teamId);
      }
    } else if (type === "v") {
      const rowQuestions = categories
        .map((cat) => cat.questions[idx])
        .filter(Boolean);
      const runIndices = findConsecutiveBingoRunIndices(
        rowQuestions,
        opposingTeamId,
      );
      for (const qi of runIndices) {
        const q = rowQuestions[qi];
        if (q) cells.set(q.id, teamId);
      }
    }
  }

  return cells;
}
