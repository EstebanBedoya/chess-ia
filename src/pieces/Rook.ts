import { Piece, Position, PieceType } from './Piece';

export class Rook extends Piece {
  getType(): PieceType {
    return 'rook';
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const directions = [
      { row: -1, col: 0 },  // arriba
      { row: 1, col: 0 },   // abajo
      { row: 0, col: -1 },  // izquierda
      { row: 0, col: 1 }    // derecha
    ];

    return this.getMovesInDirection(board, directions);
  }
} 