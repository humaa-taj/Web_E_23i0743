import React from 'react';
import { TOTAL_BALLS, TOTAL_WICKETS, formatOvers } from './gameData.js';

// ==================== SCOREBOARD ====================
const Scoreboard = ({ runs, wickets, ballsBowled, lastOutcome, strikeRate }) => {
  const ballsRemaining = TOTAL_BALLS - ballsBowled;
  const oversStr = formatOvers(ballsBowled);

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <span className="team-name">🏏 PAKISTAN XI</span>
        <div className="main-score">
          <span className="runs-display">{runs}</span>
          <span className="wickets-display">/{wickets}</span>
        </div>
        <span className="overs-display">({oversStr} ov)</span>
      </div>

      <div className="scoreboard-stats">
        <div className="stat-item">
          <div className="stat-val">{ballsRemaining}</div>
          <div className="stat-lbl">Balls Left</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{TOTAL_WICKETS - wickets}</div>
          <div className="stat-lbl">Wkts Left</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{strikeRate.toFixed(1)}</div>
          <div className="stat-lbl">S/Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-val">{oversStr}</div>
          <div className="stat-lbl">Overs</div>
        </div>
      </div>

      {lastOutcome && (
        <div className={`last-outcome ${lastOutcome.isWicket ? 'wicket' : 'runs'}`}>
          {lastOutcome.isWicket ? '🎳 WICKET!' : `+${lastOutcome.runs} ${lastOutcome.runs === 1 ? 'RUN' : 'RUNS'}`}
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
