import { Cell, Move, Piece, PlayerColor, BoardSize } from '../models/types';

// Direction a piece can move (row delta)
function getMoveDirs(piece: Piece): number[] {
  if (piece.type === 'king') return [-1, 1];
  return piece.color === 'red' ? [-1] : [1]; // red moves up, black moves down
}

// Check if position is inside the board
function inBounds(row: number, col: number, size: BoardSize): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

// Get all simple (non-capture) moves for a piece
function getSimpleMoves(piece: Piece, board: Cell[][], size: BoardSize): Move[] {
  const moves: Move[] = [];
  const dirs = getMoveDirs(piece);

  for (const rowDir of dirs) {
    for (const colDir of [-1, 1]) {
      if (piece.type === 'king') {
        // King slides diagonally until blocked
        let r = piece.row + rowDir;
        let c = piece.col + colDir;
        while (inBounds(r, c, size)) {
          const cell = board[r][c];
          if (cell.piece) break; // blocked
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

// Get all capture moves for a piece (recursive for chain captures)
function getCaptureMoves(
  piece: Piece,
  board: Cell[][],
  size: BoardSize,
  capturedIds: Set<string> = new Set()
): Move[] {
  const moves: Move[] = [];
  for (const rowDir of [-1, 1]) {
    for (const colDir of [-1, 1]) {
      if (piece.type === 'king') {
        // King can capture any enemy piece along the diagonal
        let r = piece.row + rowDir;
        let c = piece.col + colDir;
        let enemyFound: Piece | null = null;
        let enemyRow = -1, enemyCol = -1;

        while (inBounds(r, c, size)) {
          const cell = board[r][c];
          if (cell.piece) {
            if (cell.piece.color === piece.color || capturedIds.has(cell.piece.id)) break;
            if (enemyFound) break; // second enemy in same diagonal — stop
            enemyFound = cell.piece;
            enemyRow = r;
            enemyCol = c;
          } else if (enemyFound) {
            // Landing square after captured piece
            moves.push({
              fromRow: piece.row,
              fromCol: piece.col,
              toRow: r,
              toCol: c,
              captures: [{ row: enemyRow, col: enemyCol, pieceId: enemyFound.id }],
            });
          }
          r += rowDir;
          c += colDir;
        }
      } else {
        // Man: jumps exactly 2 squares
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
            fromRow: piece.row,
            fromCol: piece.col,
            toRow: landR,
            toCol: landC,
            captures: [{ row: midR, col: midC, pieceId: midCell.piece.id }],
          });
        }
      }
    }
  }
  return moves;
}

// Get ALL valid moves for a player (captures are mandatory)
export function getAllValidMoves(color: PlayerColor, board: Cell[][], size: BoardSize): Move[] {
  const allPieces: Piece[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const p = board[r][c].piece;
      if (p && p.color === color) allPieces.push(p);
    }
  }

  // Check if any captures exist (captures are mandatory)
  const captures: Move[] = [];
  for (const piece of allPieces) {
    captures.push(...getCaptureMoves(piece, board, size));
  }
  if (captures.length > 0) return captures;

  // No captures — return simple moves
  const simple: Move[] = [];
  for (const piece of allPieces) {
    simple.push(...getSimpleMoves(piece, board, size));
  }
  return simple;
}

// Get valid moves for a specific piece
export function getValidMovesForPiece(piece: Piece, board: Cell[][], size: BoardSize, mustCapture: boolean): Move[] {
  if (mustCapture) {
    return getCaptureMoves(piece, board, size);
  }
  const captures = getCaptureMoves(piece, board, size);
  if (captures.length > 0) return captures;
  return getSimpleMoves(piece, board, size);
}

// Check if a piece should be promoted to king
export function shouldPromote(piece: Piece, toRow: number, size: BoardSize): boolean {
  if (piece.type === 'king') return false;
  return piece.color === 'red' ? toRow === 0 : toRow === size - 1;
}

// Apply a move to the board (mutates board for performance)
export function applyMove(move: Move, board: Cell[][], piece: Piece, size: BoardSize): void {
  // Remove from old position
  board[move.fromRow][move.fromCol].piece = null;

  // Remove captured pieces
  for (const cap of move.captures) {
    board[cap.row][cap.col].piece = null;
  }

  // Place piece at new position
  const updatedPiece: Piece = {
    ...piece,
    row: move.toRow,
    col: move.toCol,
    type: shouldPromote(piece, move.toRow, size) ? 'king' : piece.type,
  };
  board[move.toRow][move.toCol].piece = updatedPiece;
}
