import { Piece, Position, PieceType } from './Piece';

export class Knight extends Piece {
  getType(): PieceType {
    return 'knight';
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const validMoves: Position[] = [];
    const { row, col } = this.position;

    const possibleMoves = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 }
    ];

    for (const move of possibleMoves) {
      if (this.isWithinBoard(move)) {
        const targetPiece = board[move.row][move.col];
        if (targetPiece === null || this.isEnemyPiece(targetPiece)) {
          validMoves.push(move);
        }
      }
    }

    return validMoves;
  }
} 