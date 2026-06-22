import { BoardSize, Cell, Piece, PlayerColor } from '../models/types';

let pieceCounter = 0;
const createPieceId = () => `piece_${++pieceCounter}`;

// Create an empty board grid
export function createEmptyBoard(size: BoardSize): Cell[][] {
  const board: Cell[][] = [];
  for (let row = 0; row < size; row++) {
    board[row] = [];
    for (let col = 0; col < size; col++) {
      // Playable cells: dark squares
      // On standard boards: (row + col) % 2 === 1 are dark
      const isPlayable = (row + col) % 2 === 1;
      board[row][col] = {
        row,
        col,
        isPlayable,
        piece: null,
      };
    }
  }
  return board;
}

// Place pieces on the board for game start
// Russian (8x8): 3 rows each side, 12 pieces each
// International (10x10): 4 rows each side, 20 pieces each
export function setupInitialPieces(board: Cell[][], size: BoardSize): Map<string, Piece> {
  const pieces = new Map<string, Piece>();
  const rowsPerSide = size === 8 ? 3 : 4;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = board[row][col];
      if (!cell.isPlayable) continue;

      let color: PlayerColor | null = null;

      if (row < rowsPerSide) {
        color = 'black'; // top side = black
      } else if (row >= size - rowsPerSide) {
        color = 'red'; // bottom side = red
      }

      if (color) {
        const piece: Piece = {
          id: createPieceId(),
          color,
          type: 'man',
          row,
          col,
        };
        pieces.set(piece.id, piece);
        board[row][col].piece = piece;
      }
    }
  }

  return pieces;
}

// Deep clone the board (for AI search)
export function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map(row =>
    row.map(cell => ({
      ...cell,
      piece: cell.piece ? { ...cell.piece } : null,
    }))
  );
}
