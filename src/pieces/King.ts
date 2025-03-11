import { Piece, Position, PieceType } from './Piece';

export class King extends Piece {
  getType(): PieceType {
    return 'king';
  }

  getValidMoves(board: (Piece | null)[][]): Position[] {
    const directions = [
      { row: -1, col: -1 },  // diagonal superior izquierda
      { row: -1, col: 0 },   // arriba
      { row: -1, col: 1 },   // diagonal superior derecha
      { row: 0, col: -1 },   // izquierda
      { row: 0, col: 1 },    // derecha
      { row: 1, col: -1 },   // diagonal inferior izquierda
      { row: 1, col: 0 },    // abajo
      { row: 1, col: 1 }     // diagonal inferior derecha
    ];

    const normalMoves = this.getMovesInDirection(board, directions, 1);
    const castlingMoves = this.getCastlingMoves(board);

    return [...normalMoves, ...castlingMoves];
  }

  private getCastlingMoves(board: (Piece | null)[][]): Position[] {
    const castlingMoves: Position[] = [];
    if (this.hasMoved) return castlingMoves;

    const row = this.position.row;
    
    // Enroque corto
    if (this.canCastleKingSide(board, row)) {
      castlingMoves.push({ row, col: 6 });
    }

    // Enroque largo
    if (this.canCastleQueenSide(board, row)) {
      castlingMoves.push({ row, col: 2 });
    }

    return castlingMoves;
  }

  private canCastleKingSide(board: (Piece | null)[][], row: number): boolean {
    const rook = board[row][7];
    return rook !== null &&
           rook.getType() === 'rook' &&
           !rook.hasMoved &&
           board[row][5] === null &&
           board[row][6] === null &&
           !this.isUnderAttack(board, { row, col: 4 }) &&
           !this.isUnderAttack(board, { row, col: 5 }) &&
           !this.isUnderAttack(board, { row, col: 6 });
  }

  private canCastleQueenSide(board: (Piece | null)[][], row: number): boolean {
    const rook = board[row][0];
    return rook !== null &&
           rook.getType() === 'rook' &&
           !rook.hasMoved &&
           board[row][1] === null &&
           board[row][2] === null &&
           board[row][3] === null &&
           !this.isUnderAttack(board, { row, col: 4 }) &&
           !this.isUnderAttack(board, { row, col: 3 }) &&
           !this.isUnderAttack(board, { row, col: 2 });
  }

  private isUnderAttack(board: (Piece | null)[][], position: Position): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.getColor() !== this.color) {
          const moves = piece.getValidMoves(board);
          if (moves.some(move => move.row === position.row && move.col === position.col)) {
            return true;
          }
        }
      }
    }
    return false;
  }
} 