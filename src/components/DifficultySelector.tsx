import React from 'react';
import { Difficulty } from '../services/AIService';
import './DifficultySelector.css';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  disabled: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange,
  disabled
}) => {
  return (
    <div className="difficulty-selector">
      <label>Dificultad:</label>
      <select
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
        disabled={disabled}
      >
        <option value="easy">Fácil</option>
        <option value="medium">Medio</option>
        <option value="hard">Difícil</option>
      </select>
    </div>
  );
};

export default DifficultySelector; 