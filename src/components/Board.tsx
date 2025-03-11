import React from 'react';
import './Board.css';
import { Piece, Position } from '../pieces/Piece';

const getPieceSymbol = (piece: Piece): string => {
  const symbols = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
  };
  return symbols[piece.getColor()][piece.getType()];
};

interface BoardProps {
  board: (Piece | null)[][];
  selectedPiece: Position | null;
  validMoves: Position[];
  onSquareClick: (position: Position) => void;
}

const Board: React.FC<BoardProps> = ({ board, selectedPiece, validMoves, onSquareClick }) => {
  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.row === row && move.col === col);
  };

  const handleDragStart = (e: React.DragEvent, position: Position) => {
    const piece = board[position.row][position.col];
    if (piece) {
      e.dataTransfer.setData('text/plain', JSON.stringify(position));
      onSquareClick(position); // Para mostrar los movimientos válidos mientras arrastramos
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necesario para permitir el drop
  };

  const handleDrop = (e: React.DragEvent, dropPosition: Position) => {
    e.preventDefault();
    const startPosition = JSON.parse(e.dataTransfer.getData('text/plain')) as Position;
    
    // Solo permitir el drop si es un movimiento válido
    if (isValidMove(dropPosition.row, dropPosition.col)) {
      onSquareClick(dropPosition);
    }
  };

  const renderSquare = (row: number, col: number) => {
    const piece = board[row][col];
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
    const isValidMoveSquare = isValidMove(row, col);

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isLight ? 'light' : 'dark'} 
                   ${isSelected ? 'selected' : ''} 
                   ${isValidMoveSquare ? 'valid-move' : ''}`}
        onClick={() => onSquareClick({ row, col })}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, { row, col })}
      >
        {piece && (
          <div 
            className={`piece ${piece.getColor()}`}
            draggable
            onDragStart={(e) => handleDragStart(e, { row, col })}
          >
            {getPieceSymbol(piece)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="board">
      {Array(8).fill(null).map((_, row) => (
        <div key={row} className="row">
          {Array(8).fill(null).map((_, col) => renderSquare(row, col))}
        </div>
      ))}
    </div>
  );
};

export default Board; 