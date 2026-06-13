# The Great Tournament of Game Knowledge

A bilingual, Jeopardy-style host board for two-team video game trivia. One person runs the game on a shared screen while two teams compete to answer questions, use lifelines, and chase bingo bonuses.

**[Play now →](https://game-knowledge-quiz.vercel.app/)**

---

## How it works

This is a **host tool**, not a solo quiz app. The Game Master shares their screen, clicks the board, reveals answers, and assigns points. Teams call out category and point values, discuss answers, and request lifelines - but only the host interacts with the app.

The board is a **6×6 grid**: six video game categories across the top, six point tiers (100–600) going down. Higher values mean harder questions.

```
┌─────────────┬─────────────┬─────────────┬ ── ··· ── ┬─────────────┐
│  Category 1 │  Category 2 │  Category 3 │           │  Category 6 │
├─────────────┼─────────────┼─────────────┼ ── ··· ── ┼─────────────┤
│     100     │     100     │     100     │           │     100     │  ← easy
│     200     │     200     │     200     │           │     200     │
│     300     │     300     │     300     │           │     300     │
│     400     │     400     │     400     │           │     400     │
│     500     │     500     │     500     │           │     500     │
│     600     │     600     │     600     │           │     600     │  ← hard
└─────────────┴─────────────┴─────────────┴ ── ··· ── ┴─────────────┘
```

---

## Game rules

### Game Master

Having a **Game Master is strongly recommended** - in practice, it is required for a smooth game. This person:

- Shares their screen and operates the board
- Reads questions aloud and reveals answers
- Activates lifelines when teams request them
- Assigns points after each question
- Keeps turn order fair

Teams should **never** click the board themselves. They call out answers verbally; the host records the outcome.

### Turn order

1. Pick the starting team at random - [WheelDecider](https://wheeldecider.com) works well.
2. That team picks the first question.
3. Turns alternate: Team A → Team B → Team A → … for the rest of the game.

### Picking questions

On their turn, a team chooses any cell that **has not been answered yet**.

A cell is considered answered once the host assigns an outcome - including **No Points** (wrong answer or nobody scored). Answered cells show the winning team’s color, a dash (**"-"**), or **No Points**. Those cells cannot be picked again.

Questions get harder as point values increase: **100 = easy**, **600 = hard**.

### Double points

At the start of each game (or after a reset), **two random questions** secretly award **2× points**. The multiplier is hidden until the host opens the question - look for the yellow **2x** badge in the modal. These are high-value picks; teams cannot know which cells they are until opened.

### Scoring a question

1. Host clicks an unanswered cell to open it.
2. (Optional) A team uses a lifeline.
3. Host clicks **Reveal Answer**.
4. Host assigns **Team 1**, **No Points**, or **Team 2**.

The active team earns the cell’s point value (or 2× if it is a double-points question). **No Points** means nobody gets the points, but the cell is still closed.

### Lifelines

Each team starts with **three lifelines**. Each lifeline can be used **once per game**. Only **one lifeline can be active at a time** across both teams - once activated, it stays active until the question is resolved.

| Lifeline | What it does |
|----------|--------------|
| **ABCD** | Shows four possible answers (A/B/C/D). Works only on questions that have multiple-choice options in the preset; open-text questions will not show choices. |
| **Call a Friend** | The team may call someone (e.g. on Discord). The host gives them **30 seconds** to talk - the app shows a reminder, but the host runs the timer. |
| **Steal a Question** | The stealing team takes over a question **after** the opposing team has chosen it but **before** the host assigns an outcome. Scoring still goes through the host buttons. |

Used lifelines disappear from the scoreboard at the bottom of the screen.

### End of game

The game ends when **every question on the board has been answered**. The team with the **highest total score** wins. Bingo bonuses (+600 each) can swing the final result, so double-check the scoreboard before declaring a winner.

---

## Bingo

Bingo is a **bonus scoring mechanic** built into the board - not a separate game mode. A team that completes a bingo line earns **+600 points** instantly.

### How to earn bingo

Complete **5 consecutive qualifying cells** in either direction:

**Column bingo** - five questions in a single category, top to bottom:

```
Category: The Sims
┌───────┐
│  100  │ ✓  qualifying
│  200  │ ✓  qualifying
│  300  │ ✓  qualifying
│  400  │ ✓  qualifying
│  500  │ ✓  qualifying  →  BINGO! +600
│  600  │    (not required for this bingo)
└───────┘
```

**Row bingo** - five questions at the same point tier, left to right across categories:

```
300-point row
┌──────┬──────┬──────┬──────┬──────┬──────┐
│ Cat1 │ Cat2 │ Cat3 │ Cat4 │ Cat5 │ Cat6 │
│  ✓   │  ✓   │  ✓   │  ✓   │  ✓   │      │  →  BINGO! +600
└──────┴──────┴──────┴──────┴──────┴──────┘
```

You do not need all six cells in a row - five consecutive qualifying cells is enough.

### What counts as qualifying

For **Team 1** to claim a cell toward bingo, that cell must be answered and **Team 2 must not have gotten the points**. Concretely, these count for Team 1:

- Team 1 answered correctly (blue cell)
- **No Points** (dash / grey cell) - this counts for **both** teams

Team 2’s correct answers (red cells) do **not** count toward Team 1’s bingo, and vice versa.

### What you will see

- Qualifying cells in an active bingo line show a small **"B"** badge on the board.
- A full-screen **BINGO!** animation plays for a few seconds.
- The scoreboard shows a **"Bingo N"** badge for each team that has earned bingo(s).

### Bingo can be revoked

If the host **reassigns** an answer and breaks a five-in-a-row, the bingo is removed and **600 points are deducted** automatically. Use the click-to-cycle feature (see below) carefully after a bingo has been awarded.

---

## Host tips and quality-of-life features

### Fix mistakes without reopening the modal

**Click any answered cell** on the board to cycle its outcome:

**Team 1 → Team 2 → No Points → Team 1 → …**

Scores (including 2× double-points values) and bingo status update automatically.

### Rename teams

Click a team name in the bottom scoreboard to edit it inline.

### Reveal before scoring

Always click **Reveal Answer** before assigning Team 1 / No Points / Team 2. This lets teams see the correct answer and, with the ABCD lifeline, highlights the right option in green.

### Language toggle

Switch between **Polish** and **English** using the globe button. Both the UI and question text update. The app opens in **Polish** by default. Default team names migrate when you switch languages if you have not renamed them.

### Progress persists

Game state is saved in the browser (localStorage). Refreshing the page keeps scores, answered cells, bingos, lifeline usage, and the active preset.

### Reset and presets

- **Reset** - clears all progress (scores, answers, bingos, lifelines) but keeps the current question preset.
- **Presets** - choose from five themed question sets. Loading a new preset resets all progress; the app asks for confirmation first.

### Question types

Presets can include several question formats:

- **ABCD** - multiple choice (options appear with the ABCD lifeline or after reveal)
- **Open text** - no options shown
- **Image** - picture displayed in the modal
- **Audio** - audio clip with a built-in player

### Suggested host workflow

1. Open the app, pick a preset, rename teams, share your screen.
2. Spin a wheel to decide the starting team.
3. Active team calls a category and point value.
4. Host opens the cell → optional lifeline → reveal answer → assign outcome.
5. Alternate turns until the board is full.
6. Announce the winner - highest score wins.

---

## Question presets

Five themed boards are included. **Preset 5** loads by default.

| Preset | Categories |
|--------|------------|
| Preset 1 | Lethal Company, WoW, Helldivers, Fortnite, Bloons TD, Payday |
| Preset 2 | FIFA, EA, Monster Hunter, LoL, Batman: Arkham, Fighters |
| Preset 3 | Rockstar, Borderlands, Mass Effect, Pokémon, L4D, Stardew Valley |
| Preset 4 | RDR, Civilization, GTA, Witcher, CS, Minecraft |
| Preset 5 (default) | The Sims, E-sport, Half-Life, Clash Royale, TLOU, Fallout |

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Local setup

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

### Other commands

```bash
pnpm build    # production build
pnpm start    # run production server
pnpm lint     # Biome lint
pnpm format   # Biome format
```

### Tech stack

- **Next.js 16** (App Router), **React 19**
- **Zustand** for game state (persisted to localStorage)
- **Tailwind CSS 4**, **Framer Motion**, **shadcn/ui**

### Question data

Presets live as JSON files under [`public/preset*/`](public/). Each file defines six categories with six questions (100–600 points). Question types, bilingual text, options, and media URLs are all defined in JSON.

### Deploy

The app is hosted on [Vercel](https://game-knowledge-quiz.vercel.app/). To deploy your own copy, connect the repo to Vercel or run `pnpm build` and serve the output.
