import React from 'react';
import { TOTAL_BALLS, formatOvers } from './gameData.js';

// ==================== GAME OVER SCREEN ====================
const GameOver = ({ runs, wickets, ballsBowled, onRestart }) => {
  const reason = wickets >= 2 ? 'All Out!' : 'Overs Complete!';
  const strikeRate = ballsBowled > 0 ? ((runs / ballsBowled) * 100).toFixed(1) : '0.0';
  const rating = runs >= 60 ? '🔥 Legendary!' : runs >= 40 ? '⭐ Excellent!' : runs >= 25 ? '👍 Good effort!' : '😔 Tough game.';

  return (
    <div className="gameover-overlay">
      <div className="gameover-card">
        <div className="gameover-title">INNINGS COMPLETE</div>
        <div className="gameover-reason">{reason}</div>

        <div className="gameover-scorecard">
          <div className="gc-row">
            <span>Total Score</span>
            <span className="gc-val highlight">{runs}/{wickets}</span>
          </div>
          <div className="gc-row">
            <span>Overs Played</span>
            <span className="gc-val">{formatOvers(ballsBowled)}</span>
          </div>
          <div className="gc-row">
            <span>Balls Faced</span>
            <span className="gc-val">{ballsBowled}</span>
          </div>
          <div className="gc-row">
            <span>Strike Rate</span>
            <span className="gc-val">{strikeRate}</span>
          </div>
          <div className="gc-row">
            <span>Wickets Lost</span>
            <span className="gc-val">{wickets}</span>
          </div>
        </div>

        <div className="gameover-rating">{rating}</div>

        <button className="restart-btn" onClick={onRestart}>
          🔄 NEW INNINGS
        </button>
      </div>
    </div>
  );
};

export default GameOver;
