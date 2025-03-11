import { Piece, Position, PieceType } from './Piece';

export class Queen extends Piece {
  getType(): PieceType {
    return 'queen';
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const directions = [
      { row: -1, col: 0 },   // arriba
      { row: 1, col: 0 },    // abajo
      { row: 0, col: -1 },   // izquierda
      { row: 0, col: 1 },    // derecha
      { row: -1, col: -1 },  // diagonal superior izquierda
      { row: -1, col: 1 },   // diagonal superior derecha
      { row: 1, col: -1 },   // diagonal inferior izquierda
      { row: 1, col: 1 }     // diagonal inferior derecha
    ];

    return this.getMovesInDirection(board, directions);
  }
} 