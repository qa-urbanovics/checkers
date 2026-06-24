import { useCallback, useMemo } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CellView } from './CellView';

const BOARD_PADDING = 14; // each side

function getContainerWidth(): number {
  const ua = navigator.userAgent;
  const w = window.innerWidth;
  const h = window.innerHeight;

  const isIpad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const isPhone = /iPhone|iPod|Android/i.test(ua) && !isIpad;

  // Real phone
  if (isPhone || (w <= 500 && !isIpad)) return w;

  // Desktop frame
  if (w > 1400 && !isIpad) return 390;

  // iPad or tablet browser (501–1400px) — fill the screen properly
  const maxByWidth  = Math.floor(w * 0.92);
  const maxByHeight = Math.floor((h - 200) * 0.95);
  return Math.min(maxByWidth, maxByHeight, 820);
}

function calcCellSize(boardSize: number): number {
  const available = getContainerWidth() - BOARD_PADDING * 2;
  return Math.floor(available / boardSize);
}

export function BoardView() {
  const { game, selectPiece, makeMove, settings } = useGameStore();
  const { board, boardSize, selectedPiece, validMoves } = game;

  // Recalculate on each render (handles orientation change)
  const cellSize = useMemo(() => calcCellSize(boardSize), [boardSize]);

  const validMoveSet = useMemo(() => {
    const set = new Set<string>();
    for (const m of validMoves) set.add(`${m.toRow}-${m.toCol}`);
    return set;
  }, [validMoves]);

  const captureSet = useMemo(() => {
    const set = new Set<string>();
    for (const m of validMoves) {
      if (m.captures.length > 0) set.add(`${m.toRow}-${m.toCol}`);
    }
    return set;
  }, [validMoves]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (game.status !== 'playing') return;
    const cell = board[row][col];
    const moveKey = `${row}-${col}`;

    if (validMoveSet.has(moveKey) && selectedPiece) {
      const move = validMoves.find(m => m.toRow === row && m.toCol === col);
      if (move) { makeMove(move); return; }
    }

    if (cell.piece && cell.piece.color === game.currentTurn) {
      selectPiece(cell.piece);
    }
  }, [board, validMoves, validMoveSet, selectedPiece, game, selectPiece, makeMove]);

  const boardPx = cellSize * boardSize;

  // Map settings boardTheme to CellView theme type
  const rawTheme = settings.boardTheme as string;
  const theme = (['classic', 'emerald', 'wood', 'marble'].includes(rawTheme)
    ? rawTheme
    : 'emerald') as 'classic' | 'emerald' | 'wood' | 'marble';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
      <div style={{
        width: boardPx,
        height: boardPx,
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 12px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(94,204,134,0.1)',
        flexShrink: 0,
      }}>
        {board.map((row, rIdx) => (
          <div key={rIdx} style={{ display: 'flex' }}>
            {row.map((cell, cIdx) => {
              const key = `${rIdx}-${cIdx}`;
              const isPieceSelected = selectedPiece?.row === rIdx && selectedPiece?.col === cIdx;
              const showMove = settings.showValidMoves && selectedPiece !== null && validMoveSet.has(key);
              const showCapture = showMove && captureSet.has(key);

              return (
                <CellView
                  key={key}
                  cell={cell}
                  cellSize={cellSize}
                  isSelected={isPieceSelected}
                  isValidMove={showMove}
                  isCapture={showCapture}
                  boardTheme={theme}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
