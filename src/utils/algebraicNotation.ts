import { Position, Piece, PieceType } from '../pieces/Piece';

export function positionToAlgebraic(position: Position): string {
  const file = String.fromCharCode(97 + position.col); // a-h
  const rank = 8 - position.row; // 1-8
  return `${file}${rank}`;
}

export function algebraicToPosition(algebraic: string): Position {
  const file = algebraic.charAt(0).toLowerCase();
  const rank = parseInt(algebraic.charAt(1));
  return {
    row: 8 - rank,
    col: file.charCodeAt(0) - 97
  };
}

export function moveToAlgebraic(from: Position, to: Position, board: (Piece | null)[][]): string {
  const piece = board[from.row][from.col];
  if (!piece) return '';

  const pieceSymbol = getPieceSymbol(piece.getType());
  const fromSquare = positionToAlgebraic(from);
  const toSquare = positionToAlgebraic(to);
  const isCapture = board[to.row][to.col] !== null;

  // Castling
  if (piece.getType() === 'king') {
    if (from.col === 4) {
      if (to.col === 6) return 'O-O';   // Kingside
      if (to.col === 2) return 'O-O-O'; // Queenside
    }
  }

  return `${pieceSymbol}${isCapture ? 'x' : ''}${toSquare}`;
}

export function algebraicToMove(algebraic: string, board: (Piece | null)[][]): { from: Position; to: Position } | null {
  // Handle castling
  if (algebraic === 'O-O') {
    const row = board[0][4]?.getColor() === 'white' ? 7 : 0;
    return {
      from: { row, col: 4 },
      to: { row, col: 6 }
    };
  }
  if (algebraic === 'O-O-O') {
    const row = board[0][4]?.getColor() === 'white' ? 7 : 0;
    return {
      from: { row, col: 4 },
      to: { row, col: 2 }
    };
  }

  // Regular moves
  const match = algebraic.match(/^([KQRBN])?([a-h][1-8])$/);
  if (!match) return null;

  const [, pieceSymbol, targetSquare] = match;
  const targetPos = algebraicToPosition(targetSquare);

  // Find the piece that can make this move
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && 
          (!pieceSymbol || getPieceSymbol(piece.getType()) === pieceSymbol) &&
          piece.isValidMove(targetPos, board)) {
        return {
          from: { row, col },
          to: targetPos
        };
      }
    }
  }

  return null;
}

function getPieceSymbol(type: PieceType): string {
  switch (type) {
    case 'king': return 'K';
    case 'queen': return 'Q';
    case 'rook': return 'R';
    case 'bishop': return 'B';
    case 'knight': return 'N';
    case 'pawn': return '';
  }
} 