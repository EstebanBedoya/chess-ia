import { Piece, Position, PieceType } from '../Piece';

// Clase de prueba que extiende Piece para testing
class TestPiece extends Piece {
  getType(): PieceType {
    return 'pawn';
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    return [];
  }
}

describe('Piece', () => {
  let piece: TestPiece;

  beforeEach(() => {
    piece = new TestPiece({ row: 0, col: 0 }, 'white');
  });

  test('should initialize with correct properties', () => {
    expect(piece.getColor()).toBe('white');
    expect(piece.getPosition()).toEqual({ row: 0, col: 0 });
    expect(piece.hasMoved).toBe(false);
  });

  test('should update position correctly', () => {
    piece.setPosition({ row: 1, col: 1 });
    expect(piece.getPosition()).toEqual({ row: 1, col: 1 });
    expect(piece.hasMoved).toBe(true);
  });

  test('should correctly identify enemy pieces', () => {
    const enemyPiece = new TestPiece({ row: 1, col: 1 }, 'black');
    const friendlyPiece = new TestPiece({ row: 2, col: 2 }, 'white');
    
    expect(piece.isEnemyPiece(enemyPiece)).toBe(true);
    expect(piece.isEnemyPiece(friendlyPiece)).toBe(false);
    expect(piece.isEnemyPiece(null)).toBe(false);
  });
}); 