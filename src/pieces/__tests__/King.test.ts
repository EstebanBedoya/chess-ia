import { King } from '../King';
import { Piece } from '../Piece';

describe('King', () => {
  let board: (Piece | null)[][];
  let king: King;

  beforeEach(() => {
    // Crear un tablero vacío 8x8
    board = Array(8).fill(null).map(() => Array(8).fill(null));
    king = new King({ row: 4, col: 4 }, 'white');
    board[4][4] = king;
  });

  test('should get correct type', () => {
    expect(king.getType()).toBe('king');
  });

  test('should get valid moves in empty board', () => {
    const validMoves = king.getValidMoves(board);
    const expectedMoves = [
      { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
      { row: 4, col: 3 }, { row: 4, col: 5 },
      { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 }
    ];

    expect(validMoves).toHaveLength(8);
    expectedMoves.forEach(move => {
      expect(validMoves).toContainEqual(move);
    });
  });

  test('should not move into check', () => {
    // Colocar una torre enemiga que amenaza algunas casillas
    const enemyRook = new King({ row: 4, col: 7 }, 'black');
    board[4][7] = enemyRook;

    const validMoves = king.getValidMoves(board);
    
    // No debería poder moverse a la misma fila que la torre
    expect(validMoves).not.toContainEqual({ row: 4, col: 5 });
  });

  test('should identify castling moves when available', () => {
    // Configurar posición inicial del rey
    king = new King({ row: 7, col: 4 }, 'white');
    board[7][4] = king;
    
    // Añadir torre en posición inicial
    const rook = new King({ row: 7, col: 7 }, 'white');
    board[7][7] = rook;

    const validMoves = king.getValidMoves(board);
    
    // Debería incluir el enroque corto si las condiciones son correctas
    expect(validMoves).toContainEqual({ row: 7, col: 6 });
  });
}); 