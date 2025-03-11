import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Game from '../Game';
// import { ChessPieceBase } from '../../types';

describe('Game Component', () => {
  const renderGame = () => render(<Game />);

  beforeEach(() => {
    // Limpiar el DOM entre pruebas
    jest.clearAllMocks();
  });

  test('initializes with correct board setup', () => {
    renderGame();
    // Verificar que todas las piezas están en su posición inicial
    expect(screen.getByTestId('piece-1-0')).toHaveTextContent('♟︎'); // Peón negro
    expect(screen.getByTestId('piece-0-0')).toHaveTextContent('♜'); // Torre negra
    expect(screen.getByTestId('piece-0-4')).toHaveTextContent('♚'); // Rey negro
    expect(screen.getByTestId('piece-6-0')).toHaveTextContent('♙'); // Peón blanco
    expect(screen.getByTestId('piece-7-0')).toHaveTextContent('♖'); // Torre blanca
    expect(screen.getByTestId('piece-7-4')).toHaveTextContent('♔'); // Rey blanco
  });

  test('starts with white turn', () => {
    renderGame();
    expect(screen.getByText(/Turno: Blancas/i)).toBeInTheDocument();
  });

  test('selects and shows valid moves for white piece', () => {
    renderGame();
    // Intentar seleccionar un peón blanco
    const whitePawn = screen.getByTestId('piece-6-0');
    fireEvent.click(whitePawn);

    // Verificar que se muestran los movimientos válidos
    const validMoveSquares = screen.getAllByTestId(/square-5-0|square-4-0/);
    validMoveSquares.forEach(square => {
      expect(square).toHaveClass('valid-move');
    });
  });

  test('prevents moving black pieces on white turn', () => {
    renderGame();
    // Intentar seleccionar un peón negro en el turno de las blancas
    const blackPawn = screen.getByTestId('piece-1-0');
    fireEvent.click(blackPawn);

    // No deberían mostrarse movimientos válidos
    const squares = screen.getAllByTestId(/square/);
    squares.forEach(square => {
      expect(square).not.toHaveClass('valid-move');
    });
  });

  test('moves piece to valid position', () => {
    renderGame();
    // Seleccionar un peón blanco
    const whitePawn = screen.getByTestId('piece-6-0');
    fireEvent.click(whitePawn);

    // Mover a una posición válida
    const targetSquare = screen.getByTestId('square-5-0');
    fireEvent.click(targetSquare);

    // Verificar que el peón se movió
    expect(screen.getByTestId('piece-5-0')).toHaveTextContent('♙');
    // Verificar que el turno cambió a las negras
    expect(screen.getByText(/Turno: Negras/i)).toBeInTheDocument();
  });

  test('detects check condition', () => {
    renderGame();
    // Este test requeriría varios movimientos para crear una situación de jaque
    // Implementar una secuencia de movimientos que lleve a un jaque
    // Verificar que se muestra el mensaje de jaque
    // Verificar que solo se permiten movimientos que resuelven el jaque
  });
}); 