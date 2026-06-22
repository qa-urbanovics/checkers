import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { detectLanguage } from '../i18n';
import {
  GameState, GameMode, AIDifficulty, BoardSize, PlayerColor,
  Piece, Move, Screen, AppSettings, PlayerStats, GameStatus, GameSnapshot
} from '../models/types';
import { createEmptyBoard, setupInitialPieces } from '../engine/boardFactory';
import { getAllValidMoves, getValidMovesForPiece, shouldPromote } from '../engine/moveValidator';
import { getBestMove } from '../engine/aiEngine';

// ============================================================
// GAME STORE (Zustand)
// ============================================================

interface GameStore {
  // Navigation
  screen: Screen;
  setScreen: (screen: Screen) => void;

  // Setup state (before game starts)
  pendingMode: GameMode;
  pendingBoardSize: BoardSize;
  pendingDifficulty: AIDifficulty;
  setPendingMode: (mode: GameMode) => void;
  setPendingBoardSize: (size: BoardSize) => void;
  setPendingDifficulty: (diff: AIDifficulty) => void;

  // Game
  game: GameState;
  startGame: () => void;
  selectPiece: (piece: Piece) => void;
  makeMove: (move: Move) => void;
  undoMove: () => void;
  resetGame: () => void;

  // Settings
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;

  // Stats
  stats: PlayerStats;
  resetStats: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticEnabled: true,
  showValidMoves: true,
  boardTheme: 'emerald',
  pieceTheme: 'classic',
  language: detectLanguage(),
};

const DEFAULT_STATS: PlayerStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  totalGames: 0,
  winsVsAI: { easy: 0, medium: 0, hard: 0 },
  winsPvp: 0,
};

function createInitialGameState(
  mode: GameMode,
  boardSize: BoardSize,
  difficulty: AIDifficulty
): GameState {
  const board = createEmptyBoard(boardSize);
  const pieces = setupInitialPieces(board, boardSize);

  return {
    board,
    pieces,
    currentTurn: 'red',
    status: 'playing',
    boardSize,
    gameMode: mode,
    aiDifficulty: difficulty,
    rules: boardSize === 8 ? 'russian' : 'international',
    selectedPiece: null,
    validMoves: [],
    moveHistory: [],
    captureChain: null,
    winner: null,
    redPiecesCount: boardSize === 8 ? 12 : 20,
    blackPiecesCount: boardSize === 8 ? 12 : 20,
    turnCount: 0,
    stateHistory: [],
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      screen: 'home',
      setScreen: (screen) => set({ screen }),

      pendingMode: 'pvp',
      pendingBoardSize: 8,
      pendingDifficulty: 'medium',
      setPendingMode: (mode) => set({ pendingMode: mode }),
      setPendingBoardSize: (size) => set({ pendingBoardSize: size }),
      setPendingDifficulty: (diff) => set({ pendingDifficulty: diff }),

      game: createInitialGameState('pvp', 8, 'medium'),

      startGame: () => {
        const { pendingMode, pendingBoardSize, pendingDifficulty } = get();
        set({
          game: createInitialGameState(pendingMode, pendingBoardSize, pendingDifficulty),
          screen: 'game',
        });
      },

      selectPiece: (piece) => {
        const { game } = get();
        if (game.status !== 'playing') return;
        if (piece.color !== game.currentTurn) return;

        // If in capture chain, only allow the chain piece
        if (game.captureChain && (game.captureChain.fromRow !== piece.row || game.captureChain.fromCol !== piece.col)) return;

        const mustCapture = game.captureChain !== null ||
          getAllValidMoves(game.currentTurn, game.board, game.boardSize, game.rules)
            .some(m => m.captures.length > 0);

        const validMoves = getValidMovesForPiece(piece, game.board, game.boardSize, mustCapture, game.rules);

        set({
          game: {
            ...game,
            selectedPiece: piece,
            validMoves,
          }
        });
      },

      makeMove: (move) => {
        const { game, stats } = get();
        if (game.status !== 'playing') return;

        const piece = game.board[move.fromRow][move.fromCol].piece;
        if (!piece) return;

        // Save snapshot for undo at the start of each fresh turn (not mid-chain)
        let stateHistory = game.stateHistory;
        if (game.captureChain === null) {
          const snap: GameSnapshot = {
            board: game.board.map(row => row.map(cell => ({ ...cell, piece: cell.piece ? { ...cell.piece } : null }))),
            pieces: new Map(Array.from(game.pieces.entries()).map(([k, v]) => [k, { ...v }])),
            currentTurn: game.currentTurn,
            redPiecesCount: game.redPiecesCount,
            blackPiecesCount: game.blackPiecesCount,
            turnCount: game.turnCount,
          };
          stateHistory = [...stateHistory, snap].slice(-30);
        }

        // Clone board and apply move
        const newBoard = game.board.map(row => row.map(cell => ({
          ...cell, piece: cell.piece ? { ...cell.piece } : null
        })));
        const newPieces = new Map(game.pieces);

        // Remove captured pieces
        for (const cap of move.captures) {
          newBoard[cap.row][cap.col].piece = null;
          newPieces.delete(cap.pieceId);
        }

        // Move piece
        newBoard[move.fromRow][move.fromCol].piece = null;
        const promoted = shouldPromote(piece, move.toRow, game.boardSize);
        const movedPiece: Piece = {
          ...piece,
          row: move.toRow,
          col: move.toCol,
          type: promoted ? 'king' : piece.type,
        };
        newBoard[move.toRow][move.toCol].piece = movedPiece;
        newPieces.set(movedPiece.id, movedPiece);

        // Count pieces
        let redCount = 0, blackCount = 0;
        for (const p of newPieces.values()) {
          if (p.color === 'red') redCount++;
          else blackCount++;
        }

        // Check for continued capture chain.
        // Both rule sets: on promotion mid-chain, piece continues capturing as a king.
        let captureChain: Move | null = null;
        const canContinue = move.captures.length > 0;
        if (canContinue) {
          const chainMoves = getValidMovesForPiece(movedPiece, newBoard, game.boardSize, true, game.rules);
          if (chainMoves.length > 0) {
            captureChain = { ...move, fromRow: move.toRow, fromCol: move.toCol };
          }
        }

        // Switch turn
        const nextTurn: PlayerColor = captureChain ? game.currentTurn :
          (game.currentTurn === 'red' ? 'black' : 'red');

        // Check win condition
        let winner: PlayerColor | null = null;
        let status: GameStatus = 'playing';
        const nextMoves = getAllValidMoves(nextTurn, newBoard, game.boardSize, game.rules);

        if (redCount === 0) { winner = 'black'; status = 'finished'; }
        else if (blackCount === 0) { winner = 'red'; status = 'finished'; }
        else if (nextMoves.length === 0) { winner = game.currentTurn; status = 'finished'; }

        // Update stats
        let newStats = stats;
        if (status === 'finished' && winner) {
          newStats = {
            ...stats,
            totalGames: stats.totalGames + 1,
            wins: winner === 'red' ? stats.wins + 1 : stats.wins,
            losses: winner === 'black' ? stats.losses + 1 : stats.losses,
          };
          if (game.gameMode === 'ai' && winner === 'red') {
            newStats.winsVsAI = {
              ...newStats.winsVsAI,
              [game.aiDifficulty]: newStats.winsVsAI[game.aiDifficulty] + 1,
            };
          }
          if (game.gameMode === 'pvp') {
            newStats.winsPvp = newStats.winsPvp + 1;
          }
        }

        // Haptic feedback on native iOS
        if (Capacitor.isNativePlatform() && get().settings.hapticEnabled) {
          if (status === 'finished') {
            Haptics.notification({ type: NotificationType.Success });
          } else if (move.captures.length > 0) {
            Haptics.impact({ style: ImpactStyle.Medium });
          } else {
            Haptics.impact({ style: ImpactStyle.Light });
          }
        }

        set({
          stats: newStats,
          game: {
            ...game,
            board: newBoard,
            pieces: newPieces,
            currentTurn: nextTurn,
            status,
            winner,
            selectedPiece: captureChain ? movedPiece : null,
            validMoves: captureChain
              ? getValidMovesForPiece(movedPiece, newBoard, game.boardSize, true, game.rules)
              : nextMoves,
            moveHistory: [...game.moveHistory, move],
            captureChain,
            redPiecesCount: redCount,
            blackPiecesCount: blackCount,
            turnCount: game.turnCount + 1,
            stateHistory,
          }
        });

        // AI turn
        const updatedGame = get().game;
        if (
          updatedGame.status === 'playing' &&
          updatedGame.gameMode === 'ai' &&
          updatedGame.currentTurn === 'black'
        ) {
          setTimeout(() => {
            const state = get().game;
            if (state.captureChain) {
              // Continue the mandatory capture chain
              const chainMove = state.validMoves[0];
              if (chainMove) get().makeMove(chainMove);
            } else {
              const aiMove = getBestMove(state.board, 'black', state.aiDifficulty, state.boardSize, state.rules);
              if (aiMove) get().makeMove(aiMove);
            }
          }, 400);
        }
      },

      undoMove: () => {
        const { game } = get();
        const history = game.stateHistory;
        // In AI mode: undo 2 snapshots (AI response + player move)
        // In PvP: undo 1 snapshot
        const stepsBack = game.gameMode === 'ai' ? 2 : 1;
        if (history.length < 1) return;
        const targetIdx = Math.max(0, history.length - stepsBack);
        const snap = history[targetIdx];
        if (!snap) return;
        set({
          game: {
            ...game,
            board: snap.board,
            pieces: snap.pieces,
            currentTurn: snap.currentTurn,
            redPiecesCount: snap.redPiecesCount,
            blackPiecesCount: snap.blackPiecesCount,
            turnCount: snap.turnCount,
            selectedPiece: null,
            validMoves: getAllValidMoves(snap.currentTurn, snap.board, game.boardSize, game.rules),
            captureChain: null,
            status: 'playing',
            winner: null,
            moveHistory: game.moveHistory.slice(0, -stepsBack),
            stateHistory: history.slice(0, targetIdx),
          }
        });
      },

      resetGame: () => {
        const { game } = get();
        set({
          game: createInitialGameState(game.gameMode, game.boardSize, game.aiDifficulty),
        });
      },

      settings: DEFAULT_SETTINGS,
      updateSettings: (patch) => set(s => ({ settings: { ...s.settings, ...patch } })),

      stats: DEFAULT_STATS,
      resetStats: () => set({ stats: DEFAULT_STATS }),
    }),
    {
      name: 'checkers-storage',
      partialize: (state) => ({ settings: state.settings, stats: state.stats }),
    }
  )
);
