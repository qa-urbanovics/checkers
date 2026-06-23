// ============================================================
// CORE TYPES — Checkers App
// ============================================================

export type PlayerColor = 'red' | 'black';

export type PieceType = 'man' | 'king';

export type BoardSize = 8 | 10;

export type GameMode = 'pvp' | 'ai';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export type GameRules = 'russian' | 'international';

export type GameStatus = 'playing' | 'finished';

export type Screen = 'home' | 'mode-select' | 'board-select' | 'difficulty-select' | 'game' | 'settings' | 'stats' | 'rules';

// A piece on the board
export interface Piece {
  id: string;
  color: PlayerColor;
  type: PieceType;
  row: number;
  col: number;
}

// A single move (from → to, with optional captures)
export interface Move {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  captures: Array<{ row: number; col: number; pieceId: string }>;
}

// Board cell
export interface Cell {
  row: number;
  col: number;
  isPlayable: boolean; // dark cells only
  piece: Piece | null;
}

// Snapshot for undo
export interface GameSnapshot {
  board: Cell[][];
  pieces: Map<string, Piece>;
  currentTurn: PlayerColor;
  redPiecesCount: number;
  blackPiecesCount: number;
  turnCount: number;
}

// Full game state
export interface GameState {
  board: Cell[][];
  pieces: Map<string, Piece>;
  currentTurn: PlayerColor;
  status: GameStatus;
  boardSize: BoardSize;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  rules: GameRules;
  selectedPiece: Piece | null;
  validMoves: Move[];
  moveHistory: Move[];
  captureChain: Move | null; // current piece forced to continue capturing
  winner: PlayerColor | null;
  redPiecesCount: number;
  blackPiecesCount: number;
  turnCount: number;
  stateHistory: GameSnapshot[];
  positionCounts: Record<string, number>;
}

// Player stats (persisted)
export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
  winsVsAI: {
    easy: number;
    medium: number;
    hard: number;
  };
  winsPvp: number;
}

// App settings (persisted)
export interface AppSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  showValidMoves: boolean;
  boardTheme: 'emerald' | 'classic' | 'wood' | 'marble';
  pieceTheme: 'classic' | 'color';
  language: 'en' | 'ru' | 'es';
}
