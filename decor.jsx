// Bali-themed inline SVG decorations: monstera leaves, frangipani, waves, palm fronds.
// All are designed to drop into corners and section margins.

function MonsteraLeaf({ size = 200, color = "currentColor", style }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={style} fill="none">
      <g fill={color}>
        <path d="M100 18 Q60 25 45 60 Q30 95 35 130 Q42 165 75 178 Q90 184 100 184 Q110 184 125 178 Q158 165 165 130 Q170 95 155 60 Q140 25 100 18 Z" opacity="0.85"/>
        <path d="M100 28 L100 178" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      </g>
      <g fill="#F4EADB" opacity="0.85">
        <ellipse cx="70" cy="55" rx="10" ry="22" transform="rotate(-30 70 55)"/>
        <ellipse cx="130" cy="55" rx="10" ry="22" transform="rotate(30 130 55)"/>
        <ellipse cx="55" cy="100" rx="12" ry="24" transform="rotate(-80 55 100)"/>
        <ellipse cx="145" cy="100" rx="12" ry="24" transform="rotate(80 145 100)"/>
        <ellipse cx="65" cy="145" rx="10" ry="20" transform="rotate(-110 65 145)"/>
        <ellipse cx="135" cy="145" rx="10" ry="20" transform="rotate(110 135 145)"/>
      </g>
    </svg>
  );
}

function PalmFrond({ size = 240, color = "currentColor", style }) {
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} style={style} fill="none">
      <g stroke={color} strokeWidth="1.5" fill="none" opacity="0.85">
        <path d="M120 230 Q120 150 120 30"/>
        {[...Array(11)].map((_, i) => {
          const y = 30 + i * 18;
          const len = 30 + Math.min(i, 10 - i) * 9;
          return (
            <g key={i}>
              <path d={`M120 ${y} Q${120 - len * 0.5} ${y - 8} ${120 - len} ${y - 14}`}/>
              <path d={`M120 ${y} Q${120 + len * 0.5} ${y - 8} ${120 + len} ${y - 14}`}/>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function Frangipani({ size = 80, color = "currentColor", style }) {
  // 5-petal plumeria flower with a yellow center
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      <g transform="translate(50 50)">
        {[0, 72, 144, 216, 288].map(angle => (
          <ellipse
            key={angle}
            cx="0"
            cy="-22"
            rx="14"
            ry="22"
            fill={color}
            opacity="0.85"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="9" fill="#E8C77A"/>
      </g>
    </svg>
  );
}

function Wave({ width = 200, color = "currentColor", style }) {
  return (
    <svg viewBox="0 0 200 40" width={width} height={width * 0.2} style={style} fill="none">
      <path d="M0 20 Q25 0 50 20 T100 20 T150 20 T200 20" stroke={color} strokeWidth="1.2" opacity="0.6"/>
      <path d="M0 28 Q25 8 50 28 T100 28 T150 28 T200 28" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

function HeartDivider({ color = "currentColor", style }) {
  return (
    <svg viewBox="0 0 120 12" width="120" height="12" style={style} fill="none">
      <line x1="0" y1="6" x2="48" y2="6" stroke={color} strokeWidth="1" opacity="0.4"/>
      <path d="M60 4 Q56 1 52 4 Q49 7 60 11 Q71 7 68 4 Q64 1 60 4 Z" fill={color} opacity="0.7"/>
      <line x1="72" y1="6" x2="120" y2="6" stroke={color} strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}

function MapPin({ size = 56, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 2 C7.6 2 4 5.6 4 10 C4 16 12 22 12 22 S20 16 20 10 C20 5.6 16.4 2 12 2 Z M12 13 C10.3 13 9 11.7 9 10 S10.3 7 12 7 S15 8.3 15 10 S13.7 13 12 13 Z"/>
    </svg>
  );
}

function ArrowIcon({ dir = "right", size = 18 }) {
  const rotate = dir === "left" ? 180 : 0;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M5 12 L19 12 M13 6 L19 12 L13 18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SoundIcon({ on = false, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M3 9 H7 L12 5 V19 L7 15 H3 Z"/>
      {on && (
        <>
          <path d="M15 8 Q18 12 15 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M17 5 Q22 12 17 19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </>
      )}
      {!on && (
        <path d="M15 9 L21 15 M21 9 L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      )}
    </svg>
  );
}

Object.assign(window, { MonsteraLeaf, PalmFrond, Frangipani, Wave, HeartDivider, MapPin, ArrowIcon, SoundIcon });
