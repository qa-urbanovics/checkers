import { AIDifficulty, BoardSize, Cell, GameRules, Move, Piece, PlayerColor } from '../models/types';
import { getAllValidMoves, getValidMovesForPiece, applyMove } from './moveValidator';
import { cloneBoard } from './boardFactory';

// ============================================================
// AI ENGINE — Minimax with Alpha-Beta Pruning
// ============================================================

const DIFFICULTY_DEPTH: Record<AIDifficulty, number> = {
  easy: 1,
  medium: 3,
  hard: 7,
};

function evaluate(board: Cell[][], size: BoardSize): number {
  let score = 0;
  const center = size / 2 - 0.5;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const piece = board[r][c].piece;
      if (!piece) continue;

      const isRed = piece.color === 'red';
      const mul = isRed ? 1 : -1;

      // Piece value: king worth significantly more
      score += mul * (piece.type === 'king' ? 420 : 100);

      // Center control
      const distToCenter = Math.abs(r - center) + Math.abs(c - center);
      score += mul * (size - distToCenter) * 2;

      if (piece.type === 'man') {
        // Advancement bonus — closer to promotion
        const advancement = isRed ? size - 1 - r : r;
        score += mul * advancement * 5;

        // Back row defense: keep at least some pieces protecting home row
        const backRow = isRed ? size - 1 : 0;
        if (r === backRow) score += mul * 14;
      } else {
        // King mobility bonus: kings on non-edge squares are more effective
        if (c > 0 && c < size - 1 && r > 0 && r < size - 1) score += mul * 10;
      }

      // Edge penalty — edge pieces are less mobile
      if (c === 0 || c === size - 1) score -= mul * 9;
    }
  }

  return score;
}

// A single resolved outcome: the first step taken + final board after full capture chain.
interface MoveOutcome {
  firstMove: Move;
  finalBoard: Cell[][];
}

// Expand a capture chain to completion, returning all possible final boards.
// This handles multi-jump sequences so the AI evaluates complete moves, not partial ones.
function expandChain(piece: Piece, board: Cell[][], size: BoardSize, rules: GameRules): Cell[][][] {
  const chainMoves = getValidMovesForPiece(piece, board, size, true, rules);
  if (chainMoves.length === 0) return [board];

  const results: Cell[][][] = [];
  for (const move of chainMoves) {
    const cloned = cloneBoard(board);
    const p = cloned[move.fromRow][move.fromCol].piece!;
    applyMove(move, cloned, p, size);
    const movedPiece = cloned[move.toRow][move.toCol].piece!;

    // On promotion mid-chain, piece continues as king in both rule sets
    results.push(...expandChain(movedPiece, cloned, size, rules));
  }
  return results;
}

// All possible complete moves (including full capture chains) for a color.
function getAIMoves(
  color: PlayerColor,
  board: Cell[][],
  size: BoardSize,
  rules: GameRules
): MoveOutcome[] {
  const singleMoves = getAllValidMoves(color, board, size, rules);
  const outcomes: MoveOutcome[] = [];

  for (const move of singleMoves) {
    const cloned = cloneBoard(board);
    const piece = cloned[move.fromRow][move.fromCol].piece!;
    applyMove(move, cloned, piece, size);

    if (move.captures.length === 0) {
      outcomes.push({ firstMove: move, finalBoard: cloned });
      continue;
    }

    // Expand chain: the player must complete all captures
    const movedPiece = cloned[move.toRow][move.toCol].piece!;
    // On promotion mid-chain, piece continues as king in both rule sets
    const finalBoards = expandChain(movedPiece, cloned, size, rules);
    for (const fb of finalBoards) {
      outcomes.push({ firstMove: move, finalBoard: fb });
    }
  }

  return outcomes;
}

function minimax(
  board: Cell[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiColor: PlayerColor,
  size: BoardSize,
  rules: GameRules
): number {
  // evaluate() returns + = good for red. Red maximizes, black minimizes.
  const currentColor: PlayerColor = isMaximizing ? 'red' : 'black';
  const outcomes = getAIMoves(currentColor, board, size, rules);

  if (depth === 0 || outcomes.length === 0) {
    if (outcomes.length === 0) return isMaximizing ? -10000 : 10000;
    return evaluate(board, size);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const outcome of outcomes) {
      const score = minimax(outcome.finalBoard, depth - 1, alpha, beta, false, aiColor, size, rules);
      if (score > maxEval) maxEval = score;
      if (maxEval > alpha) alpha = maxEval;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const outcome of outcomes) {
      const score = minimax(outcome.finalBoard, depth - 1, alpha, beta, true, aiColor, size, rules);
      if (score < minEval) minEval = score;
      if (minEval < beta) beta = minEval;
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function getBestMove(
  board: Cell[][],
  aiColor: PlayerColor,
  difficulty: AIDifficulty,
  size: BoardSize,
  rules: GameRules
): Move | null {
  const outcomes = getAIMoves(aiColor, board, size, rules);
  if (outcomes.length === 0) return null;

  // Easy: 65% random move — clearly weaker than medium
  if (difficulty === 'easy' && Math.random() < 0.65) {
    return outcomes[Math.floor(Math.random() * outcomes.length)].firstMove;
  }

  const depth = DIFFICULTY_DEPTH[difficulty];
  let bestMove: Move | null = null;
  // AI is black → minimizes (evaluate + = good for red = bad for black)
  let bestScore = Infinity;

  for (const outcome of outcomes) {
    // After AI (black) moves, red goes next → isMaximizing = true
    const score = minimax(outcome.finalBoard, depth - 1, -Infinity, Infinity, true, aiColor, size, rules);
    if (score < bestScore) {
      bestScore = score;
      bestMove = outcome.firstMove;
    }
  }

  return bestMove;
}
