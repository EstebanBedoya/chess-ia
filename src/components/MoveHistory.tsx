import React from 'react';
import './MoveHistory.css';

interface MoveHistoryProps {
  moves: string[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  return (
    <div className="move-history">
      <h3>Historial</h3>
      <div className="moves-list">
        {moves.map((move, index) => (
          <div key={index} className="move-entry">
            <span className="move-number">{Math.floor(index / 2) + 1}.</span>
            <span className={`move-text ${index % 2 === 0 ? 'white' : 'black'}`}>
              {move}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveHistory; 