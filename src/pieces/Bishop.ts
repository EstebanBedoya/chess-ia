import { Piece, Position, PieceType } from './Piece';

export class Bishop extends Piece {
  getType(): PieceType {
    return 'bishop';
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const directions = [
      { row: -1, col: -1 },  // diagonal superior izquierda
      { row: -1, col: 1 },   // diagonal superior derecha
      { row: 1, col: -1 },   // diagonal inferior izquierda
      { row: 1, col: 1 }     // diagonal inferior derecha
    ];

    return this.getMovesInDirection(board, directions);
  }
} 