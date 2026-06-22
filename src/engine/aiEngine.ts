import { AIDifficulty, BoardSize, Cell, GameRules, Move, Piece, PlayerColor } from '../models/types';
import { getAllValidMoves, getValidMovesForPiece, applyMove, shouldPromote } from './moveValidator';
import { cloneBoard } from './boardFactory';

interface CapturedPiece { row: number; col: number; id: string; }

// ============================================================
// AI ENGINE — Minimax with Alpha-Beta Pruning
// ============================================================

// Depths per difficulty. Hard is capped lower on 10×10 to avoid UI freeze
// (more pieces = much higher branching factor early game).
const DIFFICULTY_DEPTH: Record<AIDifficulty, Record<BoardSize, number>> = {
  easy:   { 8: 1,  10: 1  },
  medium: { 8: 3,  10: 3  },
  hard:   { 8: 7,  10: 5  },
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
// Captured pieces stay on the board during the chain (FMJD rule — they block king paths).
// They are removed only when the chain ends (no more captures available).
function expandChain(
  piece: Piece,
  board: Cell[][],
  capturedInChain: CapturedPiece[],
  size: BoardSize,
  rules: GameRules
): Cell[][][] {
  const capturedIds = new Set(capturedInChain.map(c => c.id));
  const chainMoves = getValidMovesForPiece(piece, board, size, true, rules, capturedIds);

  if (chainMoves.length === 0) {
    // Chain complete — produce final board with all captured pieces removed
    const final = cloneBoard(board);
    for (const cap of capturedInChain) final[cap.row][cap.col].piece = null;
    return [final];
  }

  const results: Cell[][][] = [];
  for (const move of chainMoves) {
    const cloned = cloneBoard(board);
    const cap = move.captures[0];
    // Move the piece; do NOT remove the captured piece yet
    cloned[move.fromRow][move.fromCol].piece = null;
    const isPromoted = shouldPromote(piece, move.toRow, size);
    const moved: Piece = {
      ...piece, row: move.toRow, col: move.toCol,
      type: isPromoted ? 'king' : piece.type,
    };
    cloned[move.toRow][move.toCol].piece = moved;
    const newCaptured = [...capturedInChain, { row: cap.row, col: cap.col, id: cap.pieceId }];
    results.push(...expandChain(moved, cloned, newCaptured, size, rules));
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
    if (move.captures.length === 0) {
      const cloned = cloneBoard(board);
      const piece = cloned[move.fromRow][move.fromCol].piece!;
      applyMove(move, cloned, piece, size);
      outcomes.push({ firstMove: move, finalBoard: cloned });
      continue;
    }

    // Capture move: keep captured piece on board during chain expansion (FMJD rule)
    const cloned = cloneBoard(board);
    const piece = cloned[move.fromRow][move.fromCol].piece!;
    const cap = move.captures[0];
    cloned[move.fromRow][move.fromCol].piece = null;
    const isPromoted = shouldPromote(piece, move.toRow, size);
    const movedPiece: Piece = {
      ...piece, row: move.toRow, col: move.toCol,
      type: isPromoted ? 'king' : piece.type,
    };
    cloned[move.toRow][move.toCol].piece = movedPiece;
    const capturedInChain: CapturedPiece[] = [{ row: cap.row, col: cap.col, id: cap.pieceId }];
    const finalBoards = expandChain(movedPiece, cloned, capturedInChain, size, rules);
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
      const score = minimax(outcome.finalBoard, depth - 1, alpha, beta, false, size, rules);
      if (score > maxEval) maxEval = score;
      if (maxEval > alpha) alpha = maxEval;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const outcome of outcomes) {
      const score = minimax(outcome.finalBoard, depth - 1, alpha, beta, true, size, rules);
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

  const depth = DIFFICULTY_DEPTH[difficulty][size];
  let bestMove: Move | null = null;
  // AI is black → minimizes (evaluate + = good for red = bad for black)
  let bestScore = Infinity;

  for (const outcome of outcomes) {
    // After AI (black) moves, red goes next → isMaximizing = true
    const score = minimax(outcome.finalBoard, depth - 1, -Infinity, Infinity, true, size, rules);
    if (score < bestScore) {
      bestScore = score;
      bestMove = outcome.firstMove;
    }
  }

  return bestMove;
}
