import React from 'react';

// ==================== POWER BAR COMPONENT ====================
// Shows probability segments and a moving slider
const PowerBar = ({ segments, sliderPos, isActive, onShot, canShoot }) => {
  const BAR_WIDTH = 100; // percentage

  return (
    <div className="powerbar-container">
      <div className="powerbar-label">POWER BAR — Click to Play Shot!</div>

      {/* Segments row */}
      <div className="powerbar-wrapper">

        {/* The colored segments */}
        <div className="powerbar-track">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="powerbar-segment"
              style={{
                width: `${seg.prob * 100}%`,
                backgroundColor: seg.color,
              }}
            >
              <span className="segment-label">{seg.label}</span>
              <span className="segment-prob">{Math.round(seg.prob * 100)}%</span>
            </div>
          ))}

          {/* Moving slider */}
          {isActive && (
            <div
              className="powerbar-slider"
              style={{ left: `${sliderPos * 100}%` }}
            />
          )}
        </div>

        {/* Scale below */}
        <div className="powerbar-scale">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="scale-tick"
              style={{ left: `${seg.start * 100}%` }}
            >
              <div className="tick-line" />
              <span className="tick-val">{seg.start.toFixed(2)}</span>
            </div>
          ))}
          <div className="scale-tick" style={{ left: '100%' }}>
            <div className="tick-line" />
            <span className="tick-val">1.00</span>
          </div>
        </div>
      </div>

      {/* Slider position readout */}
      <div className="slider-readout">
        {isActive
          ? `Slider: ${sliderPos.toFixed(3)}`
          : 'Awaiting next ball...'}
      </div>

      {/* Shoot button */}
      <button
        className={`shoot-btn ${canShoot ? 'active' : 'disabled'}`}
        onClick={onShot}
        disabled={!canShoot}
      >
        {canShoot ? '🏏 PLAY SHOT' : '⏳ WAIT...'}
      </button>
    </div>
  );
};

export default PowerBar;
