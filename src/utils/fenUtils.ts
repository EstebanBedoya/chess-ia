import { Piece } from '../pieces/Piece';

export function boardToFEN(board: (Piece | null)[][], currentTurn: 'white' | 'black'): string {
  let fen = '';
  
  // 1. Posición de las piezas
  for (let row = 0; row < 8; row++) {
    let emptySquares = 0;
    
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      
      if (piece === null) {
        emptySquares++;
      } else {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        
        let pieceChar = getPieceFENChar(piece);
        fen += piece.getColor() === 'white' ? pieceChar.toUpperCase() : pieceChar.toLowerCase();
      }
    }
    
    if (emptySquares > 0) {
      fen += emptySquares;
    }
    
    if (row < 7) {
      fen += '/';
    }
  }
  
  // 2. Turno actual
  fen += ` ${currentTurn.charAt(0)}`;
  
  // 3. Enroque (por ahora asumimos que siempre es posible)
  fen += ' KQkq';
  
  // 4. Casilla de en passant (por ahora ninguna)
  fen += ' -';
  
  // 5. Contador de medios movimientos (por ahora 0)
  fen += ' 0';
  
  // 6. Número de movimiento completo (por ahora 1)
  fen += ' 1';
  
  return fen;
}

function getPieceFENChar(piece: Piece): string {
  switch (piece.getType()) {
    case 'pawn': return 'p';
    case 'rook': return 'r';
    case 'knight': return 'n';
    case 'bishop': return 'b';
    case 'queen': return 'q';
    case 'king': return 'k';
    default: throw new Error(`Tipo de pieza desconocido: ${piece.getType()}`);
  }
} 