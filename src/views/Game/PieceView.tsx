import { Piece } from '../../models/types';
import { useGameStore } from '../../store/gameStore';

interface PieceViewProps {
  piece: Piece;
  isSelected: boolean;
  size: number;
}

// ── Piece style definitions ───────────────────────────────────
// classic: traditional white vs black checkers
// color: crimson red vs forest green (Emerald Courts theme)

const PIECE_STYLES = {
  classic: {
    red: {
      outer:   'radial-gradient(circle at 38% 32%, #FFFFFF 0%, #D8D0C8 45%, #A09880 100%)',
      rim:     'radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, transparent 65%)',
      edge:    '#705840',
      shadow:  '0 4px 14px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)',
      selRing: '#5ECC86',
    },
    black: {
      outer:   'radial-gradient(circle at 38% 32%, #484848 0%, #1C1C1C 45%, #050505 100%)',
      rim:     'radial-gradient(ellipse, rgba(120,120,120,0.4) 0%, transparent 65%)',
      edge:    '#000000',
      shadow:  '0 4px 14px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5)',
      selRing: '#5ECC86',
    },
  },
  color: {
    red: {
      outer:   'radial-gradient(circle at 38% 32%, #FF8080 0%, #C62828 45%, #7B0000 100%)',
      rim:     'radial-gradient(ellipse, rgba(255,200,200,0.25) 0%, transparent 70%)',
      edge:    '#5A0000',
      shadow:  '0 4px 14px rgba(150,20,20,0.7), 0 2px 4px rgba(0,0,0,0.5)',
      selRing: '#5ECC86',
    },
    black: {
      outer:   'radial-gradient(circle at 38% 32%, #6AAA7A 0%, #2A5A3A 45%, #0D1F14 100%)',
      rim:     'radial-gradient(ellipse, rgba(160,220,180,0.22) 0%, transparent 70%)',
      edge:    '#071410',
      shadow:  '0 4px 14px rgba(0,30,10,0.8), 0 2px 4px rgba(0,0,0,0.5)',
      selRing: '#5ECC86',
    },
  },
};

export function PieceView({ piece, isSelected, size }: PieceViewProps) {
  const pieceTheme = useGameStore(s => s.settings.pieceTheme);
  const theme = PIECE_STYLES[pieceTheme] ?? PIECE_STYLES.classic;
  const isRed = piece.color === 'red';
  const style = isRed ? theme.red : theme.black;
  const d = size * 0.82;

  const shadow = isSelected
    ? `0 0 0 3px ${style.selRing}, 0 0 20px ${style.selRing}B0, 0 6px 20px rgba(0,0,0,0.7)`
    : style.shadow;

  const transform = isSelected ? 'scale(1.1) translateY(-2px)' : 'scale(1)';

  return (
    <div style={{
      width: d, height: d,
      borderRadius: '50%',
      background: style.outer,
      boxShadow: shadow,
      transform,
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Bottom edge disc for 3D depth */}
      <div style={{
        position: 'absolute',
        bottom: '-3px', left: '5%',
        width: '90%', height: '35%',
        borderRadius: '0 0 50% 50%',
        background: style.edge,
        zIndex: 0,
      }} />

      {/* Top disc face */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: style.outer,
        zIndex: 1,
      }} />

      {/* Shine highlight */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.25) 0%, transparent 55%)',
      }} />

      {/* Rim highlight */}
      <div style={{
        position: 'absolute', zIndex: 3,
        top: '8%', left: '15%',
        width: '65%', height: '25%',
        borderRadius: '50%',
        background: style.rim,
      }} />

      {/* King crown */}
      {piece.type === 'king' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'crownPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        }}>
          <svg width={d * 0.52} height={d * 0.52} viewBox="0 0 20 20" fill="none">
            <path d="M3 15 L5 7 L9 12 L10 5 L11 12 L15 7 L17 15 Z" fill="#C9A84C"/>
            <ellipse cx="10" cy="15" rx="7" ry="2" fill="#9A7820" opacity="0.6"/>
            <circle cx="3" cy="7" r="1.5" fill="#FFD700"/>
            <circle cx="10" cy="5" r="1.5" fill="#FFD700"/>
            <circle cx="17" cy="7" r="1.5" fill="#FFD700"/>
          </svg>
        </div>
      )}
    </div>
  );
}
