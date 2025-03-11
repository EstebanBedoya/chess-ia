import React from 'react';
import { PieceColor } from '../pieces/Piece';
import './PromotionDialog.css';

interface PromotionDialogProps {
  color: PieceColor;
  onSelect: (pieceType: 'queen' | 'rook' | 'bishop' | 'knight') => void;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({ color, onSelect }) => {
  const pieces = [
    { type: 'queen' as const, symbol: color === 'white' ? '♕' : '♛' },
    { type: 'rook' as const, symbol: color === 'white' ? '♖' : '♜' },
    { type: 'bishop' as const, symbol: color === 'white' ? '♗' : '♝' },
    { type: 'knight' as const, symbol: color === 'white' ? '♘' : '♞' }
  ];

  return (
    <div className="promotion-dialog-overlay">
      <div className="promotion-dialog">
        <h3>Elige una pieza para la promoción</h3>
        <div className="promotion-pieces">
          {pieces.map(({ type, symbol }) => (
            <button
              key={type}
              className={`piece ${color}`}
              onClick={() => onSelect(type)}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionDialog; 