import { AIDifficulty, BoardSize, Cell, Move, PlayerColor } from '../models/types';
import { getAllValidMoves, applyMove } from './moveValidator';
import { cloneBoard } from './boardFactory';

// ============================================================
// AI ENGINE — Minimax with Alpha-Beta Pruning
// ============================================================

const DIFFICULTY_DEPTH: Record<AIDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 6,
};

// Heuristic: evaluate board position for 'red' AI
function evaluate(board: Cell[][], size: BoardSize): number {
  let score = 0;
  const center = size / 2 - 0.5;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const piece = board[r][c].piece;
      if (!piece) continue;

      const isRed = piece.color === 'red';
      const multiplier = isRed ? 1 : -1;

      // Piece value
      score += multiplier * (piece.type === 'king' ? 300 : 100);

      // King bonus — kings are very valuable
      if (piece.type === 'king') {
        score += multiplier * 50;
      }

      // Center control bonus
      const distToCenter = Math.abs(r - center) + Math.abs(c - center);
      score += multiplier * (size - distToCenter) * 2;

      // Advancement bonus for men (closer to promotion)
      if (piece.type === 'man') {
        const advancement = isRed ? size - 1 - r : r;
        score += multiplier * advancement * 3;
      }

      // Edge pieces are slightly weaker (easier to trap)
      if (c === 0 || c === size - 1) {
        score -= multiplier * 5;
      }
    }
  }

  return score;
}

function minimax(
  board: Cell[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiColor: PlayerColor,
  size: BoardSize
): number {
  const currentColor: PlayerColor = isMaximizing ? aiColor : (aiColor === 'red' ? 'black' : 'red');
  const moves = getAllValidMoves(currentColor, board, size);

  if (depth === 0 || moves.length === 0) {
    if (moves.length === 0) {
      return isMaximizing ? -10000 : 10000; // losing position
    }
    return evaluate(board, size);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const cloned = cloneBoard(board);
      const piece = cloned[move.fromRow][move.fromCol].piece!;
      applyMove(move, cloned, piece, size);
      const evalScore = minimax(cloned, depth - 1, alpha, beta, false, aiColor, size);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Alpha-Beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const cloned = cloneBoard(board);
      const piece = cloned[move.fromRow][move.fromCol].piece!;
      applyMove(move, cloned, piece, size);
      const evalScore = minimax(cloned, depth - 1, alpha, beta, true, aiColor, size);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// Get the best move for AI
export function getBestMove(
  board: Cell[][],
  aiColor: PlayerColor,
  difficulty: AIDifficulty,
  size: BoardSize
): Move | null {
  const moves = getAllValidMoves(aiColor, board, size);
  if (moves.length === 0) return null;

  // Easy: 40% chance of random move
  if (difficulty === 'easy' && Math.random() < 0.4) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const depth = DIFFICULTY_DEPTH[difficulty];
  let bestMove: Move | null = null;
  let bestScore = -Infinity;

  for (const move of moves) {
    const cloned = cloneBoard(board);
    const piece = cloned[move.fromRow][move.fromCol].piece!;
    applyMove(move, cloned, piece, size);
    const score = minimax(cloned, depth - 1, -Infinity, Infinity, false, aiColor, size);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
