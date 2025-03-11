import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Board } from '../Board';
import { ChessPieceBase } from '../../types';
import { Position } from '../../types';

describe('Board Component', () => {
  const mockOnSquareClick = jest.fn();
  const emptyBoard: (ChessPieceBase | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  const defaultProps = {
    board: emptyBoard,
    selectedPiece: null,
    validMoves: [],
    onSquareClick: mockOnSquareClick
  };

  beforeEach(() => {
    mockOnSquareClick.mockClear();
  });

  test('renders 64 squares', () => {
    render(<Board {...defaultProps} />);
    const squares = screen.getAllByTestId('square');
    expect(squares).toHaveLength(64);
  });

  test('applies correct colors to squares', () => {
    render(<Board {...defaultProps} />);
    const squares = screen.getAllByTestId('square');
    
    // Primera casilla debe ser clara (blanca)
    expect(squares[0]).toHaveClass('square light');
    // Segunda casilla debe ser oscura (negra)
    expect(squares[1]).toHaveClass('square dark');
  });

  test('highlights valid moves', () => {
    const validMoves: Position[] = [{ row: 0, col: 1 }];
    render(<Board {...defaultProps} validMoves={validMoves} />);
    
    const squares = screen.getAllByTestId('square');
    // La casilla en la posición [0,1] debe estar marcada como movimiento válido
    expect(squares[1]).toHaveClass('valid-move');
  });

  test('calls onSquareClick with correct position', () => {
    render(<Board {...defaultProps} />);
    const squares = screen.getAllByTestId('square');
    
    fireEvent.click(squares[0]);
    expect(mockOnSquareClick).toHaveBeenCalledWith({ row: 0, col: 0 });
  });

  test('displays pieces correctly', () => {
    const mockPiece = {
      color: 'white',
      getType: () => 'king',
      position: { row: 0, col: 0 }
    } as ChessPieceBase;

    const boardWithPiece = [...emptyBoard];
    boardWithPiece[0][0] = mockPiece;

    render(<Board {...defaultProps} board={boardWithPiece} />);
    
    const piece = screen.getByTestId('piece-0-0');
    expect(piece).toBeInTheDocument();
    expect(piece).toHaveClass('piece white');
  });
}); 