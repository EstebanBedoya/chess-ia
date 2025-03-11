export interface Position {
  row: number;
  col: number;
}

export type PieceColor = 'white' | 'black';

export abstract class ChessPieceBase {
  constructor(public color: PieceColor, public position: Position) {}
  public hasMoved: boolean = false;
  abstract getType(): string;
  abstract getValidMoves(board: (ChessPieceBase | null)[][]): Position[];
  isEnemy(piece: ChessPieceBase | null): boolean {
    return piece !== null && piece.color !== this.color;
  }
} 