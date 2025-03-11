import { Piece, Position, PieceType } from './Piece';

export class Pawn extends Piece {
  getType(): PieceType {
    return 'pawn';
  }

  canBePromoted(position: Position): boolean {
    return (this.color === 'white' && position.row === 0) || 
           (this.color === 'black' && position.row === 7);
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const validMoves: Position[] = [];
    const direction = this.color === 'white' ? -1 : 1;
    const { row, col } = this.position;

    // Movimiento hacia adelante
    const oneStepForward = { row: row + direction, col };
    if (this.isWithinBoard(oneStepForward) && board[oneStepForward.row][oneStepForward.col] === null) {
      validMoves.push(oneStepForward);

      // Movimiento inicial de dos casillas
      if (!this.hasMoved) {
        const twoStepsForward = { row: row + (direction * 2), col };
        if (board[twoStepsForward.row][twoStepsForward.col] === null) {
          validMoves.push(twoStepsForward);
        }
      }
    }

    // Capturas en diagonal
    const diagonalMoves = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 }
    ];

    for (const move of diagonalMoves) {
      if (this.isWithinBoard(move)) {
        const targetPiece = board[move.row][move.col];
        if (this.isEnemyPiece(targetPiece)) {
          validMoves.push(move);
        }
      }
    }

    // TODO: Implementar en passant cuando se agregue el historial de movimientos

    return validMoves;
  }
} 