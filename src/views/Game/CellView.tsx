import { Cell } from '../../models/types';
import { PieceView } from './PieceView';

// Board theme colors — 'emerald' is the new default
const BOARD_COLORS = {
  classic: { light: '#EDCF9C', dark: '#8B4513' },
  emerald: { light: '#E8D5A3', dark: '#1A3D1C' },
  wood:    { light: '#F5DEB3', dark: '#6B3A2A' },
  marble:  { light: '#E8E8E8', dark: '#5A6A7A' },
};

interface CellViewProps {
  cell: Cell;
  cellSize: number;
  isSelected: boolean;
  isValidMove: boolean;
  isCapture: boolean;
  boardTheme: 'classic' | 'emerald' | 'wood' | 'marble';
  onClick: () => void;
}

export function CellView({
  cell, cellSize, isSelected, isValidMove, isCapture, boardTheme, onClick
}: CellViewProps) {
  const isLight = (cell.row + cell.col) % 2 === 0;
  const theme = BOARD_COLORS[boardTheme] ?? BOARD_COLORS.emerald;

  let bg = isLight ? theme.light : theme.dark;
  if (!isLight && isSelected) bg = '#1A4A6A';
  if (!isLight && isValidMove && !isSelected) {
    bg = isCapture ? '#6B1A1A' : '#0D3020';
  }

  const cellShadow = !isLight
    ? 'inset 0 1px 3px rgba(0,0,0,0.4)'
    : 'inset 0 1px 2px rgba(255,255,255,0.2)';

  return (
    <div
      onClick={onClick}
      style={{
        width: cellSize, height: cellSize,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg,
        boxShadow: cellShadow,
        cursor: cell.isPlayable ? 'pointer' : 'default',
        position: 'relative',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Valid move dot */}
      {isValidMove && !cell.piece && (
        <div style={{
          width: cellSize * 0.3, height: cellSize * 0.3,
          borderRadius: '50%',
          background: isCapture
            ? 'radial-gradient(circle, rgba(255,100,100,0.9), rgba(200,30,30,0.6))'
            : 'radial-gradient(circle, rgba(94,204,134,0.9), rgba(30,160,80,0.6))',
          boxShadow: isCapture
            ? '0 0 10px rgba(255,80,80,0.6)'
            : '0 0 10px rgba(94,204,134,0.6)',
        }} />
      )}

      {/* Valid move ring around occupied cell */}
      {isValidMove && cell.piece && (
        <div style={{
          position: 'absolute', inset: 2,
          borderRadius: 3,
          border: '2px solid rgba(94,204,134,0.7)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Piece */}
      {cell.piece && (
        <PieceView
          piece={cell.piece}
          isSelected={isSelected}
          size={cellSize}
        />
      )}
    </div>
  );
}
