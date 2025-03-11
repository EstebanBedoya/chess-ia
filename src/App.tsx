import React from 'react';
import './App.css';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Ajedrez</h1>
      <div className="board-container">
        <Game />
      </div>
    </div>
  );
};

export default App;