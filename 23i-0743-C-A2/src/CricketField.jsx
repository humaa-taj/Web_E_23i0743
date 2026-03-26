import React from "react";

// ==================== CRICKET FIELD SVG ====================
const CricketField = ({ ballPos, batAnimation, bowlAnimation, isOut }) => {
  // ballPos: {x, y} normalized 0-1
  // batAnimation: 'idle' | 'swing' | 'hit'
  // bowlAnimation: 'idle' | 'bowling' | 'approaching'

  const batX = 590; // right stumps x position
  const batY = 290;

  // Ball travels from just past left stumps (215,285) to just in front of right stumps (570,285)
  const ballStartX = 215;
  const ballEndX = 570;
  const ballX = ballStartX + (ballEndX - ballStartX) * ballPos;
  const ballY = 285;

  return (
    <svg
      viewBox="0 0 800 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a6b3a" />
          <stop offset="100%" stopColor="#2d8653" />
        </linearGradient>
        <linearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8a96e" />
          <stop offset="100%" stopColor="#b8935a" />
        </linearGradient>
        <linearGradient id="outfield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2d8653" />
          <stop offset="100%" stopColor="#1e6b3f" />
        </linearGradient>
        <radialGradient id="ball_grad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#c0392b" />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.4" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outfield */}
      <ellipse cx="400" cy="280" rx="390" ry="200" fill="url(#outfield)" />

      {/* Inner circle marking */}
      <ellipse
        cx="400"
        cy="280"
        rx="200"
        ry="110"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        strokeDasharray="8 4"
      />

      {/* Pitch - rectangular strip */}
      <rect x="200" y="255" width="400" height="70" rx="4" fill="url(#pitch)" />

      {/* Crease lines */}
      <line
        x1="350"
        y1="255"
        x2="350"
        y2="325"
        stroke="white"
        strokeWidth="2"
        opacity="0.7"
      />
      <line
        x1="450"
        y1="255"
        x2="450"
        y2="325"
        stroke="white"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Stumps - bowler end (left) */}
      <rect x="198" y="268" width="3" height="35" rx="1" fill="#f5e6c8" />
      <rect x="204" y="268" width="3" height="35" rx="1" fill="#f5e6c8" />
      <rect x="210" y="268" width="3" height="35" rx="1" fill="#f5e6c8" />
      {/* Bails */}
      <rect x="197" y="268" width="17" height="2" rx="1" fill="#f0d080" />

      {/* Stumps - batsman end (right) */}
      <rect x="588" y="268" width="3" height="35" rx="1" fill="#f5e6c8" />
      <rect x="594" y="268" width="3" height="35" rx="1" fill="#f5e6c8" />
      <rect x="600" y="268" width="3" height="35" rx="1" fill="#f5e6c8" />
      {/* Bails */}
      <rect x="587" y="268" width="17" height="2" rx="1" fill="#f0d080" />

      {/* Crowd - simple silhouettes */}
      {Array.from({ length: 40 }).map((_, i) => (
        <ellipse
          key={i}
          cx={30 + i * 19}
          cy={60 + Math.sin(i * 1.3) * 10}
          rx="8"
          ry="12"
          fill={["#e63946", "#457b9d", "#f4a261", "#2a9d8f", "#6a4c93"][i % 5]}
          opacity="0.7"
        />
      ))}

      {/* Bowler (left side) - simple figure */}
      <g transform="translate(215, 260)">
        {/* Body */}
        <rect x="-6" y="-40" width="12" height="30" rx="5" fill="#1d3557" />
        {/* Head */}
        <circle cx="0" cy="-48" r="10" fill="#f4a261" />
        {/* Helmet */}
        <path d="M-10,-52 Q0,-65 10,-52" fill="#1d3557" />
        {/* Arm (bowling action) */}
        <line
          x1="6"
          y1="-35"
          x2="25"
          y2="-55"
          stroke="#1d3557"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Legs */}
        <line
          x1="-3"
          y1="-10"
          x2="-8"
          y2="25"
          stroke="#f5f5f5"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="3"
          y1="-10"
          x2="10"
          y2="25"
          stroke="#f5f5f5"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* Batsman (right side) */}
      <g transform={`translate(${batX}, ${batY - 60})`}>
        {/* Body */}
        <rect
          x="-7"
          y="-40"
          width="14"
          height="32"
          rx="5"
          fill={isOut ? "#888" : "#16213e"}
          style={{ transition: "fill 0.3s" }}
        />
        {/* Head */}
        <circle cx="0" cy="-48" r="10" fill="#f4a261" />
        {/* Helmet */}
        <path d="M-10,-52 Q0,-65 10,-52 L12,-48 L-12,-48 Z" fill="#16213e" />
        <rect x="-2" y="-53" width="14" height="4" rx="2" fill="#16213e" />

        {/* Bat - animated based on state */}
        <g
          transform={
            batAnimation === "swing"
              ? "rotate(-60, 0, -20)"
              : batAnimation === "hit"
                ? "rotate(30, 0, -20)"
                : "rotate(0, 0, -20)"
          }
          style={{ transition: "transform 0.15s ease-out" }}
        >
          <rect x="5" y="-30" width="8" height="45" rx="3" fill="#c8a96e" />
          <rect x="4" y="-30" width="10" height="5" rx="2" fill="#a07840" />
        </g>

        {/* Arms */}
        <line
          x1="5"
          y1="-35"
          x2="18"
          y2="-20"
          stroke="#f4a261"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Legs */}
        <line
          x1="-3"
          y1="-8"
          x2="-6"
          y2="30"
          stroke="#f5f5f5"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="3"
          y1="-8"
          x2="8"
          y2="30"
          stroke="#f5f5f5"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Pads */}
        <rect
          x="-9"
          y="10"
          width="8"
          height="20"
          rx="3"
          fill="#f0f0f0"
          opacity="0.9"
        />
        <rect
          x="4"
          y="10"
          width="8"
          height="20"
          rx="3"
          fill="#f0f0f0"
          opacity="0.9"
        />
      </g>

      {/* Cricket Ball - only show if bowlAnimation is active */}
      {bowlAnimation !== "idle" && (
        <g>
          <circle
            cx={ballX}
            cy={ballY}
            r="8"
            fill="url(#ball_grad)"
            filter="url(#shadow)"
          />
          {/* Ball seam */}
          <path
            d={`M${ballX - 5},${ballY} Q${ballX},${ballY - 5} ${ballX + 5},${ballY}`}
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>
      )}

      {/* OUT flash
      {isOut && (
        <text
          x="400"
          y="200"
          textAnchor="middle"
          fontSize="60"
          fontWeight="900"
          fill="#e63946"
          fontFamily="Orbitron, sans-serif"
          style={{ filter: "drop-shadow(0 0 20px #e63946)" }}
          opacity="0.9"
        >
          OUT!
        </text>
      )} */}
    </svg>
  );
};

export default CricketField;
