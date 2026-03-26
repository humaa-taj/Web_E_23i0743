// ==================== GAME CONSTANTS ====================
export const TOTAL_OVERS = 2;
export const BALLS_PER_OVER = 6;
export const TOTAL_BALLS = TOTAL_OVERS * BALLS_PER_OVER; // 12
export const TOTAL_WICKETS = 2;

// ==================== PROBABILITY DISTRIBUTIONS ====================
// Aggressive: High risk (40% wicket), high reward (25% boundary)
export const AGGRESSIVE_PROBS = [
  { outcome: 'Wicket', runs: null, prob: 0.40, color: '#e63946', label: 'W' },
  { outcome: '0 Runs',  runs: 0,    prob: 0.10, color: '#457b9d', label: '0' },
  { outcome: '1 Run',   runs: 1,    prob: 0.10, color: '#2a9d8f', label: '1' },
  { outcome: '2 Runs',  runs: 2,    prob: 0.10, color: '#e9c46a', label: '2' },
  { outcome: '3 Runs',  runs: 3,    prob: 0.05, color: '#f4a261', label: '3' },
  { outcome: '4 Runs',  runs: 4,    prob: 0.10, color: '#6a4c93', label: '4' },
  { outcome: '6 Runs',  runs: 6,    prob: 0.15, color: '#1b998b', label: '6' },
];

// Defensive: Lower risk (20% wicket), lower reward (15% boundary)
export const DEFENSIVE_PROBS = [
  { outcome: 'Wicket', runs: null, prob: 0.20, color: '#e63946', label: 'W' },
  { outcome: '0 Runs',  runs: 0,    prob: 0.30, color: '#457b9d', label: '0' },
  { outcome: '1 Run',   runs: 1,    prob: 0.25, color: '#2a9d8f', label: '1' },
  { outcome: '2 Runs',  runs: 2,    prob: 0.10, color: '#e9c46a', label: '2' },
  { outcome: '3 Runs',  runs: 3,    prob: 0.05, color: '#f4a261', label: '3' },
  { outcome: '4 Runs',  runs: 4,    prob: 0.07, color: '#6a4c93', label: '4' },
  { outcome: '6 Runs',  runs: 6,    prob: 0.03, color: '#1b998b', label: '6' },
];

// ==================== COMMENTARY ====================
export const COMMENTARY = {
  Wicket: [
    "🎳 Bowled 'em! What a delivery, the stumps are shattered!",
    "🏏 Out! Caught behind! What a stunning dismissal!",
    "❌ LBW! The batsman's gone! Huge blow!",
    "💥 Clean bowled! The batsman had no answer to that one!",
  ],
  '6 Runs': [
    "🚀 SIX! Massive hit! That's gone into orbit!",
    "🔥 MAXIMUM! The crowd goes absolutely wild!",
    "💪 SIX! Incredible power! Right out of the ground!",
  ],
  '4 Runs': [
    "⚡ FOUR! Driven beautifully through the covers!",
    "🎯 FOUR! What a stroke, racing to the boundary!",
    "👏 FOUR! Perfectly timed, the fielders didn't stand a chance!",
  ],
  '3 Runs': [
    "🏃 Three runs! Quick between the wickets!",
    "👟 Superb running! Three taken!",
  ],
  '2 Runs': [
    "🏃 Two runs! Good placement!",
    "✌️ A couple of runs, well rotated!",
  ],
  '1 Run': [
    "👟 Pushed for a single, keeps the scoreboard ticking.",
    "1️⃣ Nudged away for one, smart cricket.",
    "🤏 Just a single, staying in the game.",
  ],
  '0 Runs': [
    "🛡️ Dot ball! Tight delivery, well defended.",
    "🔒 Good ball, no run. The pressure builds.",
    "😬 Dot! The bowler wins that exchange.",
  ],
};

export const getCommentary = (outcome) => {
  const lines = COMMENTARY[outcome] || COMMENTARY['0 Runs'];
  return lines[Math.floor(Math.random() * lines.length)];
};

// ==================== HELPERS ====================
export const buildSegments = (probs) => {
  let cumulative = 0;
  return probs.map(p => {
    const start = cumulative;
    cumulative = parseFloat((cumulative + p.prob).toFixed(10));
    return { ...p, start, end: cumulative };
  });
};

export const getOutcomeFromPosition = (position, segments) => {
  return segments.find(s => position >= s.start && position < s.end) || segments[segments.length - 1];
};

export const formatOvers = (ballsBowled) => {
  const overs = Math.floor(ballsBowled / 6);
  const balls = ballsBowled % 6;
  return `${overs}.${balls}`;
};
