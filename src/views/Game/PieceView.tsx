import { Piece } from '../../models/types';
import { useGameStore } from '../../store/gameStore';

interface PieceViewProps {
  piece: Piece;
  isSelected: boolean;
  size: number;
}

// ── Flat minimalist piece styles ─────────────────────────────
// classic: pearl white vs near-black
// color: crimson red vs forest green

const PIECE_STYLES = {
  classic: {
    red: {
      bg: '#EEEAE4',
      border: 'rgba(150,120,80,0.28)',
      ring: 'rgba(150,120,80,0.12)',
      shadow: '0 2px 7px rgba(0,0,0,0.22)',
      selRing: '#5ECC86',
    },
    black: {
      bg: '#1E1E1E',
      border: 'rgba(255,255,255,0.09)',
      ring: 'rgba(255,255,255,0.05)',
      shadow: '0 2px 7px rgba(0,0,0,0.5)',
      selRing: '#5ECC86',
    },
  },
  color: {
    red: {
      bg: '#C83232',
      border: 'rgba(255,170,170,0.22)',
      ring: 'rgba(255,170,170,0.1)',
      shadow: '0 2px 7px rgba(140,0,0,0.35)',
      selRing: '#5ECC86',
    },
    black: {
      bg: '#1E6638',
      border: 'rgba(100,210,140,0.22)',
      ring: 'rgba(100,210,140,0.1)',
      shadow: '0 2px 7px rgba(0,50,20,0.4)',
      selRing: '#5ECC86',
    },
  },
};

export function PieceView({ piece, isSelected, size }: PieceViewProps) {
  const pieceTheme = useGameStore(s => s.settings.pieceTheme);
  const theme = PIECE_STYLES[pieceTheme] ?? PIECE_STYLES.classic;
  const style = piece.color === 'red' ? theme.red : theme.black;
  const d = size * 0.82;

  return (
    <div style={{
      width: d, height: d,
      borderRadius: '50%',
      background: style.bg,
      border: `2px solid ${style.border}`,
      boxShadow: isSelected
        ? `0 0 0 2.5px ${style.selRing}, 0 0 14px ${style.selRing}80, ${style.shadow}`
        : style.shadow,
      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
      transition: 'transform 0.12s ease, box-shadow 0.12s ease',
      position: 'relative',
      flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Subtle inner ring */}
      <div style={{
        position: 'absolute', inset: 4,
        borderRadius: '50%',
        border: `1px solid ${style.ring}`,
        pointerEvents: 'none',
      }} />

      {/* King crown — flat outline style */}
      {piece.type === 'king' && (
        <svg
          width={d * 0.5} height={d * 0.45}
          viewBox="0 0 24 20" fill="none"
          style={{ position: 'relative', zIndex: 1, animation: 'crownPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)' }}
        >
          <path
            d="M3 16h18M4 16L6 7l4.5 5L12 3l1.5 9L18 7l2 9"
            stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
          <circle cx="4" cy="7" r="1.5" fill="#C9A84C" />
          <circle cx="12" cy="3" r="1.5" fill="#C9A84C" />
          <circle cx="20" cy="7" r="1.5" fill="#C9A84C" />
        </svg>
      )}
    </div>
  );
}
