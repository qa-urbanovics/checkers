import { Cell, Move, Piece, PlayerColor, BoardSize, GameRules } from '../models/types';
import { cloneBoard } from './boardFactory';

function getMoveDirs(piece: Piece): number[] {
  if (piece.type === 'king') return [-1, 1];
  return piece.color === 'red' ? [-1] : [1];
}

function inBounds(row: number, col: number, size: BoardSize): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

// Check if position is on promotion row
export function shouldPromote(piece: Piece, toRow: number, size: BoardSize): boolean {
  if (piece.type === 'king') return false;
  return piece.color === 'red' ? toRow === 0 : toRow === size - 1;
}

// Simple (non-capture) moves for a piece
function getSimpleMoves(piece: Piece, board: Cell[][], size: BoardSize): Move[] {
  const moves: Move[] = [];
  const dirs = getMoveDirs(piece);

  for (const rowDir of dirs) {
    for (const colDir of [-1, 1]) {
      if (piece.type === 'king') {
        // King slides any distance diagonally
        let r = piece.row + rowDir;
        let c = piece.col + colDir;
        while (inBounds(r, c, size)) {
          if (board[r][c].piece) break;
          moves.push({ fromRow: piece.row, fromCol: piece.col, toRow: r, toCol: c, captures: [] });
          r += rowDir;
          c += colDir;
        }
      } else {
        const r = piece.row + rowDir;
        const c = piece.col + colDir;
        if (inBounds(r, c, size) && !board[r][c].piece) {
          moves.push({ fromRow: piece.row, fromCol: piece.col, toRow: r, toCol: c, captures: [] });
        }
      }
    }
  }
  return moves;
}

// Single-step capture moves for a piece (all 4 diagonal directions).
// capturedIds: pieces already captured in this chain (skip them).
// Both Russian and International allow men to capture backward.
function getSingleCaptures(
  piece: Piece,
  board: Cell[][],
  size: BoardSize,
  capturedIds: Set<string>
): Move[] {
  const moves: Move[] = [];

  for (const rowDir of [-1, 1]) {
    for (const colDir of [-1, 1]) {
      if (piece.type === 'king') {
        // King slides along diagonal until it finds an enemy, then can land anywhere beyond
        let r = piece.row + rowDir;
        let c = piece.col + colDir;
        let enemyFound: Piece | null = null;
        let enemyRow = -1, enemyCol = -1;

        while (inBounds(r, c, size)) {
          const cell = board[r][c];
          if (cell.piece) {
            if (cell.piece.color === piece.color || capturedIds.has(cell.piece.id)) break;
            if (enemyFound) break; // second enemy on same diagonal — blocked
            enemyFound = cell.piece;
            enemyRow = r;
            enemyCol = c;
          } else if (enemyFound) {
            // Any empty square beyond the captured piece is a valid landing spot
            moves.push({
              fromRow: piece.row, fromCol: piece.col, toRow: r, toCol: c,
              captures: [{ row: enemyRow, col: enemyCol, pieceId: enemyFound.id }],
            });
          }
          r += rowDir;
          c += colDir;
        }
      } else {
        // Man jumps exactly one square over enemy
        const midR = piece.row + rowDir;
        const midC = piece.col + colDir;
        const landR = piece.row + rowDir * 2;
        const landC = piece.col + colDir * 2;

        if (!inBounds(landR, landC, size)) continue;

        const midCell = board[midR]?.[midC];
        const landCell = board[landR]?.[landC];

        if (
          midCell?.piece &&
          midCell.piece.color !== piece.color &&
          !capturedIds.has(midCell.piece.id) &&
          !landCell?.piece
        ) {
          moves.push({
            fromRow: piece.row, fromCol: piece.col, toRow: landR, toCol: landC,
            captures: [{ row: midR, col: midC, pieceId: midCell.piece.id }],
          });
        }
      }
    }
  }
  return moves;
}

// Max captures achievable from a position via DFS.
// Used for the international majority capture rule.
function maxCaptureCount(
  piece: Piece,
  board: Cell[][],
  size: BoardSize,
  capturedIds: Set<string>,
  rules: GameRules
): number {
  const singles = getSingleCaptures(piece, board, size, capturedIds);
  if (singles.length === 0) return 0;

  let best = 0;
  for (const move of singles) {
    const isPromoted = shouldPromote(piece, move.toRow, size);

    const cap = move.captures[0];
    const newIds = new Set(capturedIds);
    newIds.add(cap.pieceId);

    const temp = cloneBoard(board);
    temp[move.fromRow][move.fromCol].piece = null;
    // Captured piece stays on board (FMJD rule): it physically blocks king paths
    // in subsequent jumps. capturedIds prevents re-jumping it.
    const moved: Piece = {
      ...piece, row: move.toRow, col: move.toCol,
      type: isPromoted ? 'king' : piece.type,
    };
    temp[move.toRow][move.toCol].piece = moved;

    best = Math.max(best, 1 + maxCaptureCount(moved, temp, size, newIds, rules));
  }
  return best;
}

// Get capture moves for a piece, with majority-capture filtering for international rules.
// `required`: if provided, only return moves that can reach this many total captures.
function getCaptureMovesForPiece(
  piece: Piece,
  board: Cell[][],
  size: BoardSize,
  capturedIds: Set<string>,
  rules: GameRules,
  required?: number
): Move[] {
  const singles = getSingleCaptures(piece, board, size, capturedIds);
  if (singles.length === 0) return [];

  // Both rule sets: only return moves that are part of a max-capture sequence
  const req = required ?? maxCaptureCount(piece, board, size, capturedIds, rules);
  if (req === 0) return singles;

  return singles.filter(move => {
    const isPromoted = shouldPromote(piece, move.toRow, size);

    const cap = move.captures[0];
    const newIds = new Set(capturedIds);
    newIds.add(cap.pieceId);

    const temp = cloneBoard(board);
    temp[move.fromRow][move.fromCol].piece = null;
    // Captured piece stays on board (FMJD rule): it physically blocks king paths
    // in subsequent jumps. capturedIds prevents re-jumping it.
    const moved: Piece = {
      ...piece, row: move.toRow, col: move.toCol,
      type: isPromoted ? 'king' : piece.type,
    };
    temp[move.toRow][move.toCol].piece = moved;

    return 1 + maxCaptureCount(moved, temp, size, newIds, rules) >= req;
  });
}

// All valid moves for a color. Captures are mandatory.
// Both Russian and International: majority capture — must take the most pieces possible.
export function getAllValidMoves(
  color: PlayerColor,
  board: Cell[][],
  size: BoardSize,
  rules: GameRules
): Move[] {
  const pieces: Piece[] = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      const p = board[r][c].piece;
      if (p && p.color === color) pieces.push(p);
    }

  // Check if any captures are available
  const hasCaptures = pieces.some(p => getSingleCaptures(p, board, size, new Set()).length > 0);

  if (!hasCaptures) {
    // No captures — return all simple moves
    const moves: Move[] = [];
    for (const p of pieces) moves.push(...getSimpleMoves(p, board, size));
    return moves;
  }

  // Majority capture: must take the maximum possible pieces in any single sequence.
  // Applies to both Russian (8×8) and International (10×10) rules.
  const maxPerPiece = pieces.map(p => maxCaptureCount(p, board, size, new Set(), rules));
  const globalMax = Math.max(...maxPerPiece);

  const moves: Move[] = [];
  for (let i = 0; i < pieces.length; i++) {
    if (maxPerPiece[i] === globalMax) {
      moves.push(...getCaptureMovesForPiece(pieces[i], board, size, new Set(), rules, globalMax));
    }
  }
  return moves;
}

// Valid moves for a specific piece. Used when a piece is selected by the player.
export function getValidMovesForPiece(
  piece: Piece,
  board: Cell[][],
  size: BoardSize,
  mustCapture: boolean,
  rules: GameRules,
  capturedIds: Set<string> = new Set()
): Move[] {
  if (mustCapture) {
    return getCaptureMovesForPiece(piece, board, size, capturedIds, rules);
  }
  const captures = getSingleCaptures(piece, board, size, capturedIds);
  if (captures.length > 0) {
    return getCaptureMovesForPiece(piece, board, size, capturedIds, rules);
  }
  return getSimpleMoves(piece, board, size);
}

// Apply a move to the board (mutates in place — used by AI for search)
export function applyMove(move: Move, board: Cell[][], piece: Piece, size: BoardSize): void {
  board[move.fromRow][move.fromCol].piece = null;
  for (const cap of move.captures) {
    board[cap.row][cap.col].piece = null;
  }
  const updated: Piece = {
    ...piece,
    row: move.toRow,
    col: move.toCol,
    type: shouldPromote(piece, move.toRow, size) ? 'king' : piece.type,
  };
  board[move.toRow][move.toCol].piece = updated;
}
