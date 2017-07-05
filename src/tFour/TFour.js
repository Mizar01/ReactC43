import React from 'react';
import './TFour.css';
import Board from './Board.jsx';
import TestExpress from './TestExpress.jsx';

class TFour extends React.Component {
  
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
          <TestExpress/>
        </div>
      </div>
    );
  }
}

export default TFour;
