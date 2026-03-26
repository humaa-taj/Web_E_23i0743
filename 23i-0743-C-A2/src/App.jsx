import React, { useState, useEffect, useRef, useCallback } from 'react';
import CricketField from './CricketField.jsx';
import PowerBar from './PowerBar.jsx';
import Scoreboard from './Scoreboard.jsx';
import GameOver from './GameOver.jsx';
import {
  TOTAL_BALLS, TOTAL_WICKETS,
  AGGRESSIVE_PROBS, DEFENSIVE_PROBS,
  buildSegments, getOutcomeFromPosition, getCommentary
} from './gameData.js';
import './App.css';

// ==================== GAME STATES ====================
// 'style-select' → 'bowling' → 'shooting' → 'result' → 'style-select' | 'gameover'

const SLIDER_SPEED = 0.6; // units per second

const App = () => {
  // ── Core game state ──
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [ballsBowled, setBallsBowled] = useState(0);
  const [battingStyle, setBattingStyle] = useState(null); // 'aggressive' | 'defensive'

  // ── UI / animation state ──
  const [phase, setPhase] = useState('style-select'); // current game phase
  const [sliderPos, setSliderPos] = useState(0);
  const [sliderDir, setSliderDir] = useState(1); // 1 = right, -1 = left
  const [ballPos, setBallPos] = useState(0); // 0=bowler, 1=batsman (normalized)
  const [batAnim, setBatAnim] = useState('idle'); // idle | swing | hit
  const [isOut, setIsOut] = useState(false);
  const [commentary, setCommentary] = useState('Welcome to 2D Cricket! Select your batting style to begin.');
  const [lastOutcome, setLastOutcome] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [resultFlash, setResultFlash] = useState(null);

  // ── Refs for animation loops ──
  const sliderRaf = useRef(null);
  const bowlRaf = useRef(null);
  const lastTimeRef = useRef(null);
  const bowlTimeRef = useRef(null);

  // ── Build probability segments ──
  const segments = buildSegments(
    battingStyle === 'aggressive' ? AGGRESSIVE_PROBS : DEFENSIVE_PROBS
  );

  // ==================== SLIDER ANIMATION ====================
  const runSlider = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    setSliderPos(prev => {
      let next = prev + sliderDir * SLIDER_SPEED * dt;
      if (next >= 1) { next = 1; setSliderDir(-1); }
      if (next <= 0) { next = 0; setSliderDir(1); }
      return next;
    });

    sliderRaf.current = requestAnimationFrame(runSlider);
  }, [sliderDir]);

  // Start slider when in shooting phase
  useEffect(() => {
    if (phase === 'shooting') {
      lastTimeRef.current = null;
      sliderRaf.current = requestAnimationFrame(runSlider);
    } else {
      cancelAnimationFrame(sliderRaf.current);
    }
    return () => cancelAnimationFrame(sliderRaf.current);
  }, [phase, runSlider]);

  // ==================== BOWLING ANIMATION ====================
  const startBowlingAnimation = () => {
    setBallPos(0);
    setBatAnim('idle');
    setIsOut(false);
    setResultFlash(null);
    setPhase('bowling');

    const BOWL_DURATION = 1000; // ms
    bowlTimeRef.current = performance.now();

    const animBall = (ts) => {
      const elapsed = ts - bowlTimeRef.current;
      const t = Math.min(elapsed / BOWL_DURATION, 1);
      setBallPos(t);
      if (t < 1) {
        bowlRaf.current = requestAnimationFrame(animBall);
      } else {
        // Ball reached batsman - start shooting phase
        setPhase('shooting');
        setSliderPos(0);
        setSliderDir(1);
      }
    };
    bowlRaf.current = requestAnimationFrame(animBall);
  };

  // ==================== PLAY SHOT (click handler) ====================
  const handleShot = () => {
    if (phase !== 'shooting') return;

    // Stop slider
    cancelAnimationFrame(sliderRaf.current);
    const capturedPos = sliderPos;

    // Determine outcome from slider position
    const outcome = getOutcomeFromPosition(capturedPos, segments);
    const isWicket = outcome.outcome === 'Wicket';
    const runsScored = isWicket ? 0 : outcome.runs;

    // Trigger bat animation
    setBatAnim('swing');
    setTimeout(() => setBatAnim('hit'), 150);
    setTimeout(() => setBatAnim('idle'), 500);

    // If wicket, show OUT
    if (isWicket) {
      setTimeout(() => setIsOut(true), 200);
      setTimeout(() => setIsOut(false), 1500);
    }

    // Show result flash
    setResultFlash({ label: isWicket ? 'WICKET!' : `+${runsScored}`, isWicket });

    // Commentary
    const comment = getCommentary(outcome.outcome);
    setCommentary(comment);

    // Update scores
    const newRuns = runs + runsScored;
    const newWickets = wickets + (isWicket ? 1 : 0);
    const newBalls = ballsBowled + 1;

    setRuns(newRuns);
    setWickets(newWickets);
    setBallsBowled(newBalls);
    setLastOutcome({ runs: runsScored, isWicket });
    setPhase('result');

    // After result delay, check game over or continue
    setTimeout(() => {
      setResultFlash(null);
      if (newWickets >= TOTAL_WICKETS || newBalls >= TOTAL_BALLS) {
        setGameOver(true);
      } else {
        // Reset for next ball
        setBattingStyle(null);
        setPhase('style-select');
        setCommentary(comment);
        setBallPos(0);
      }
    }, 1800);
  };

  // ==================== RESTART GAME ====================
  const handleRestart = () => {
    setRuns(0);
    setWickets(0);
    setBallsBowled(0);
    setBattingStyle(null);
    setPhase('style-select');
    setSliderPos(0);
    setSliderDir(1);
    setBallPos(0);
    setBatAnim('idle');
    setIsOut(false);
    setGameOver(false);
    setLastOutcome(null);
    setResultFlash(null);
    setCommentary('New innings! Select your batting style to begin.');
    cancelAnimationFrame(sliderRaf.current);
    cancelAnimationFrame(bowlRaf.current);
  };

  // ==================== SELECT STYLE ====================
  const handleStyleSelect = (style) => {
    setBattingStyle(style);
    setCommentary(style === 'aggressive'
      ? '⚡ Aggressive mode! High risk, high reward!'
      : '🛡️ Defensive mode! Play it safe and steady!');
    // Kick off bowling animation
    startBowlingAnimation();
  };

  // Strike rate
  const strikeRate = ballsBowled > 0 ? (runs / ballsBowled) * 100 : 0;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="game-header">
        <div className="header-logo">🏏</div>
        <h1 className="header-title">CRICKET BLITZ</h1>
        <div className="header-sub">CS-4032 Web Programming | 23i-0743-C</div>
      </header>

      <main className="game-main">
        {/* Left: field */}
        <div className="field-section">
          <Scoreboard
            runs={runs}
            wickets={wickets}
            ballsBowled={ballsBowled}
            lastOutcome={lastOutcome}
            strikeRate={strikeRate}
          />

          <div className="field-wrapper">
            <CricketField
              ballPos={ballPos}
              batAnimation={batAnim}
              bowlAnimation={phase}
              isOut={isOut}
            />

            {/* Result flash overlay */}
            {resultFlash && (
              <div className={`result-flash ${resultFlash.isWicket ? 'flash-wicket' : 'flash-runs'}`}>
                {resultFlash.label}
              </div>
            )}
          </div>

          {/* Commentary */}
          <div className="commentary-box">
            <span className="commentary-icon">📢</span>
            <span className="commentary-text">{commentary}</span>
          </div>
        </div>

        {/* Right: controls */}
        <div className="controls-section">

          {/* Batting Style Panel */}
          <div className="style-panel">
            <div className="panel-title">BATTING STYLE</div>
            <div className="style-buttons">
              <button
                className={`style-btn aggressive ${battingStyle === 'aggressive' ? 'selected' : ''} ${phase !== 'style-select' ? 'locked' : ''}`}
                onClick={() => phase === 'style-select' && handleStyleSelect('aggressive')}
                disabled={phase !== 'style-select'}
              >
                <span className="style-icon">⚡</span>
                <span className="style-name">AGGRESSIVE</span>
                <span className="style-desc">High Risk · High Reward</span>
                <div className="style-stats">
                  <span>Wicket: 40%</span>
                  <span>Boundary: 25%</span>
                </div>
              </button>

              <button
                className={`style-btn defensive ${battingStyle === 'defensive' ? 'selected' : ''} ${phase !== 'style-select' ? 'locked' : ''}`}
                onClick={() => phase === 'style-select' && handleStyleSelect('defensive')}
                disabled={phase !== 'style-select'}
              >
                <span className="style-icon">🛡️</span>
                <span className="style-name">DEFENSIVE</span>
                <span className="style-desc">Low Risk · Low Reward</span>
                <div className="style-stats">
                  <span>Wicket: 20%</span>
                  <span>Boundary: 10%</span>
                </div>
              </button>
            </div>
          </div>

          {/* Probability table */}
          {battingStyle && (
            <div className="prob-table">
              <div className="panel-title">
                PROBABILITY TABLE — {battingStyle.toUpperCase()}
              </div>
              <table>
                <thead>
                  <tr><th>Outcome</th><th>Probability</th><th>Bar %</th></tr>
                </thead>
                <tbody>
                  {segments.map((seg, i) => (
                    <tr key={i}>
                      <td>
                        <span className="prob-dot" style={{ background: seg.color }}></span>
                        {seg.outcome}
                      </td>
                      <td>{seg.prob.toFixed(2)}</td>
                      <td>{(seg.prob * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td><strong>Total</strong></td>
                    <td><strong>1.00</strong></td>
                    <td><strong>100%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Power Bar */}
          {battingStyle && (
            <PowerBar
              segments={segments}
              sliderPos={sliderPos}
              isActive={phase === 'shooting'}
              onShot={handleShot}
              canShoot={phase === 'shooting'}
            />
          )}

          {/* Instructions if no style selected */}
          {!battingStyle && (
            <div className="instructions-panel">
              <div className="panel-title">HOW TO PLAY</div>
              <ol className="how-to-play">
                <li>Select a <strong>Batting Style</strong> above</li>
                <li>Watch the ball bowl toward you</li>
                <li>A <strong>Power Bar</strong> with colored zones appears</li>
                <li>A slider moves back and forth across the bar</li>
                <li>Click <strong>PLAY SHOT</strong> to stop the slider</li>
                <li>The zone the slider lands in determines your score!</li>
              </ol>
              <div className="rules-summary">
                <span>📊 {TOTAL_BALLS} balls</span>
                <span>🎳 {TOTAL_WICKETS} wickets</span>
                <span>🏏 2 overs</span>
              </div>
            </div>
          )}

          {/* Phase indicator */}
          <div className="phase-indicator">
            <div className={`phase-dot ${phase === 'style-select' ? 'active' : ''}`} />
            <span>Select Style</span>
            <div className={`phase-dot ${phase === 'bowling' ? 'active' : ''}`} />
            <span>Bowling</span>
            <div className={`phase-dot ${phase === 'shooting' ? 'active' : ''}`} />
            <span>Play Shot</span>
            <div className={`phase-dot ${phase === 'result' ? 'active' : ''}`} />
            <span>Result</span>
          </div>

          {/* Restart button */}
          <button className="mini-restart-btn" onClick={handleRestart}>
            🔄 Restart Game
          </button>
        </div>
      </main>

      {/* Game Over overlay */}
      {gameOver && (
        <GameOver
          runs={runs}
          wickets={wickets}
          ballsBowled={ballsBowled}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;
