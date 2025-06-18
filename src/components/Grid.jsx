import React from 'react';

function getCellStatus(letter, solution, idx, guess) {
  if (!solution) return '';
  if (solution[idx] === letter) return 'correct';
  if (letter && solution.includes(letter)) {
    // თუ ასო რამდენჯერმეა, სწორად დაითვალოს
    const correctCount = solution.split('').filter((l, i) => l === letter && guess[i] === letter).length;
    const totalCount = solution.split('').filter(l => l === letter).length;
    const guessCount = guess.slice(0, idx + 1).split('').filter(l => l === letter).length;
    if (guessCount <= totalCount - correctCount) return 'present';
  }
  return 'absent';
}

function Grid({ guesses, currentGuess, turn, solution }) {
  const rows = [];

  for (let i = 0; i < 6; i++) {
    let cells = [];
    if (i < guesses.length) {
      // უკვე გამოცნობილი სიტყვა
      for (let j = 0; j < 5; j++) {
        const letter = guesses[i][j] || '';
        const status = getCellStatus(letter, solution, j, guesses[i]);
        cells.push(
          <div className={`cell ${status}`} key={j}>{letter}</div>
        );
      }
    } else if (i === guesses.length) {
      // მიმდინარე გამოცნობა
      for (let j = 0; j < 5; j++) {
        const letter = currentGuess[j] || '';
        cells.push(
          <div className="cell" key={j}>{letter}</div>
        );
      }
    } else {
      // ცარიელი
      for (let j = 0; j < 5; j++) {
        cells.push(
          <div className="cell" key={j}></div>
        );
      }
    }
    rows.push(<div className="row" key={i}>{cells}</div>);
  }

  return <div className="grid">{rows}</div>;
}

export default Grid;