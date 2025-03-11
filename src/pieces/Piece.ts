export interface Position {
  row: number;
  col: number;
}

export type PieceColor = 'white' | 'black';
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export abstract class Piece {
  protected position: Position;
  protected color: PieceColor;
  public hasMoved: boolean;

  constructor(position: Position, color: PieceColor) {
    this.position = position;
    this.color = color;
    this.hasMoved = false;
  }

  abstract getValidMoves(board: (Piece | null)[][]): Position[];
  abstract getType(): PieceType;

  getPosition(): Position {
    return this.position;
  }

  getColor(): PieceColor {
    return this.color;
  }

  setPosition(position: Position): void {
    this.position = position;
    this.hasMoved = true;
  }

  isValidMove(targetPosition: Position, board: (Piece | null)[][]): boolean {
    const validMoves = this.getValidMoves(board);
    return validMoves.some(move => 
      move.row === targetPosition.row && move.col === targetPosition.col
    );
  }

  protected isWithinBoard(position: Position): boolean {
    return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
  }

  public isEnemyPiece(piece: Piece | null): boolean {
    return piece !== null && piece.color !== this.color;
  }

  protected getMovesInDirection(board: (Piece | null)[][], directions: Position[], maxSteps: number = 8): Position[] {
    const validMoves: Position[] = [];
    
    for (const direction of directions) {
      let currentRow = this.position.row;
      let currentCol = this.position.col;
      let steps = 0;

      while (steps < maxSteps) {
        currentRow += direction.row;
        currentCol += direction.col;
        const newPosition = { row: currentRow, col: currentCol };

        if (!this.isWithinBoard(newPosition)) break;

        const targetPiece = board[currentRow][currentCol];
        if (targetPiece === null) {
          validMoves.push(newPosition);
        } else {
          if (this.isEnemyPiece(targetPiece)) {
            validMoves.push(newPosition);
          }
          break;
        }

        steps++;
      }
    }

    return validMoves;
  }
} 