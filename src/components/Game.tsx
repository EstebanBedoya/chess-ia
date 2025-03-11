import React, { useState } from 'react';
import Board from './Board';
import { Piece, Position, PieceColor } from '../pieces/Piece';
import { Pawn } from '../pieces/Pawn';
import { Rook } from '../pieces/Rook';
import { Knight } from '../pieces/Knight';
import { Bishop } from '../pieces/Bishop';
import { Queen } from '../pieces/Queen';
import { King } from '../pieces/King';

interface GameState {
  board: (Piece | null)[][];
  currentTurn: PieceColor;
  selectedPiece: Position | null;
  validMoves: Position[];
  isCheck: boolean;
  isCheckmate: boolean;
}

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initializeBoard(),
    currentTurn: 'white',
    selectedPiece: null,
    validMoves: [],
    isCheck: false,
    isCheckmate: false
  });

  function initializeBoard(): (Piece | null)[][] {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Inicializar peones
    for (let col = 0; col < 8; col++) {
      board[1][col] = new Pawn({ row: 1, col }, 'black');
      board[6][col] = new Pawn({ row: 6, col }, 'white');
    }

    // Inicializar piezas negras
    board[0][0] = new Rook({ row: 0, col: 0 }, 'black');
    board[0][1] = new Knight({ row: 0, col: 1 }, 'black');
    board[0][2] = new Bishop({ row: 0, col: 2 }, 'black');
    board[0][3] = new Queen({ row: 0, col: 3 }, 'black');
    board[0][4] = new King({ row: 0, col: 4 }, 'black');
    board[0][5] = new Bishop({ row: 0, col: 5 }, 'black');
    board[0][6] = new Knight({ row: 0, col: 6 }, 'black');
    board[0][7] = new Rook({ row: 0, col: 7 }, 'black');

    // Inicializar piezas blancas
    board[7][0] = new Rook({ row: 7, col: 0 }, 'white');
    board[7][1] = new Knight({ row: 7, col: 1 }, 'white');
    board[7][2] = new Bishop({ row: 7, col: 2 }, 'white');
    board[7][3] = new Queen({ row: 7, col: 3 }, 'white');
    board[7][4] = new King({ row: 7, col: 4 }, 'white');
    board[7][5] = new Bishop({ row: 7, col: 5 }, 'white');
    board[7][6] = new Knight({ row: 7, col: 6 }, 'white');
    board[7][7] = new Rook({ row: 7, col: 7 }, 'white');

    return board;
  }

  const getValidMovesInCheck = (piece: Piece, board: (Piece | null)[][]): Position[] => {
    const allMoves = piece.getValidMoves(board);
    return allMoves.filter(move => {
      // Simular el movimiento
      const testBoard = board.map(row => [...row]);
      const from = piece.getPosition();
      testBoard[move.row][move.col] = piece;
      testBoard[from.row][from.col] = null;
      
      // Verificar si el movimiento resuelve el jaque
      return !checkForCheck(testBoard, piece.getColor());
    });
  };

  const handleSquareClick = (position: Position) => {
    const { board, currentTurn, selectedPiece, isCheck } = gameState;
    const clickedPiece = board[position.row][position.col];

    // Si no hay pieza seleccionada y se hace clic en una pieza del turno actual
    if (!selectedPiece) {
      if (clickedPiece && clickedPiece.getColor() === currentTurn) {
        let validMoves = clickedPiece.getValidMoves(board);
        
        // Si el rey está en jaque, filtrar solo los movimientos que lo resuelven
        if (isCheck) {
          validMoves = getValidMovesInCheck(clickedPiece, board);
          // Si no hay movimientos válidos para esta pieza cuando hay jaque, no seleccionarla
          if (validMoves.length === 0) return;
        }

        setGameState({
          ...gameState,
          selectedPiece: position,
          validMoves
        });
      }
      return;
    }

    // Si hay una pieza seleccionada
    const piece = board[selectedPiece.row][selectedPiece.col];
    if (!piece) return;

    // Si se hace clic en una casilla válida para mover
    if (isValidMove(position)) {
      const newBoard = movePiece(selectedPiece, position);
      const nextTurn = currentTurn === 'white' ? 'black' : 'white';
      const isInCheck = checkForCheck(newBoard, nextTurn);
      const isInCheckmate = isInCheck && checkForCheckmate(newBoard, nextTurn);

      setGameState({
        board: newBoard,
        currentTurn: nextTurn,
        selectedPiece: null,
        validMoves: [],
        isCheck: isInCheck,
        isCheckmate: isInCheckmate
      });
    } else {
      // Si se hace clic en otra pieza del mismo color, seleccionarla
      if (clickedPiece && clickedPiece.getColor() === currentTurn) {
        let validMoves = clickedPiece.getValidMoves(board);
        
        // Si el rey está en jaque, filtrar solo los movimientos que lo resuelven
        if (isCheck) {
          validMoves = getValidMovesInCheck(clickedPiece, board);
          // Si no hay movimientos válidos para esta pieza cuando hay jaque, no seleccionarla
          if (validMoves.length === 0) return;
        }

        setGameState({
          ...gameState,
          selectedPiece: position,
          validMoves
        });
      } else {
        // Si se hace clic en una casilla inválida, deseleccionar
        setGameState({
          ...gameState,
          selectedPiece: null,
          validMoves: []
        });
      }
    }
  };

  const isValidMove = (position: Position): boolean => {
    return gameState.validMoves.some(
      move => move.row === position.row && move.col === position.col
    );
  };

  const movePiece = (from: Position, to: Position): (Piece | null)[][] => {
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[from.row][from.col];
    
    if (piece) {
      piece.setPosition(to);
      newBoard[to.row][to.col] = piece;
      newBoard[from.row][from.col] = null;

      // Manejar enroque
      if (piece.getType() === 'king' && Math.abs(from.col - to.col) === 2) {
        const isKingSide = to.col === 6;
        const rookFromCol = isKingSide ? 7 : 0;
        const rookToCol = isKingSide ? 5 : 3;
        const rook = newBoard[from.row][rookFromCol];
        
        if (rook) {
          rook.setPosition({ row: from.row, col: rookToCol });
          newBoard[from.row][rookToCol] = rook;
          newBoard[from.row][rookFromCol] = null;
        }
      }
    }

    return newBoard;
  };

  const findKing = (board: (Piece | null)[][], color: PieceColor): Position | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.getType() === 'king' && piece.getColor() === color) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const checkForCheck = (board: (Piece | null)[][], color: PieceColor): boolean => {
    const kingPosition = findKing(board, color);
    if (!kingPosition) return false;

    // Verificar si alguna pieza enemiga puede atacar al rey
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.getColor() !== color) {
          const moves = piece.getValidMoves(board);
          if (moves.some(move => 
            move.row === kingPosition.row && move.col === kingPosition.col
          )) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const checkForCheckmate = (board: (Piece | null)[][], color: PieceColor): boolean => {
    // Si no hay jaque, no puede haber jaque mate
    if (!checkForCheck(board, color)) return false;

    // Verificar todos los movimientos posibles para todas las piezas del color actual
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.getColor() === color) {
          const validMoves = getValidMovesInCheck(piece, board);
          if (validMoves.length > 0) {
            return false; // Hay al menos un movimiento que evita el jaque mate
          }
        }
      }
    }
    return true;
  };

  return (
    <div className="game">
      <div className="game-info">
        <h2>Turno: {gameState.currentTurn === 'white' ? 'Blancas' : 'Negras'}</h2>
        {gameState.isCheck && <p>¡JAQUE!</p>}
        {gameState.isCheckmate && <p>¡JAQUE MATE!</p>}
      </div>
      <Board
        board={gameState.board}
        selectedPiece={gameState.selectedPiece}
        validMoves={gameState.validMoves}
        onSquareClick={handleSquareClick}
      />
    </div>
  );
};

export default Game; 