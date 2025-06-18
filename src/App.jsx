import React, { useState, useEffect } from 'react';

// 5-ასოიანი სიტყვების სია (შეგიძლია დაამატო მეტი)
const WORDS = [
  'apple', 'grape', 'peach', 'lemon', 'mango', 'melon', 'berry', 'plums', 'olive', 'guava'
];

// კლავიატურის ასოები
const KEYS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

function getCellStatus(letter, solution, idx, guess) {
  if (!solution) return '';
  if (solution[idx] === letter) return 'correct';
  if (letter && solution.includes(letter)) {
    // სწორად დაითვალოს რამდენჯერ არის ასო
    const correctCount = solution.split('').filter((l, i) => l === letter && guess[i] === letter).length;
    const totalCount = solution.split('').filter(l => l === letter).length;
    const guessCount = guess.slice(0, idx + 1).split('').filter(l => l === letter).length;
    if (guessCount <= totalCount - correctCount) return 'yellow';
  }
  return 'absent';
}

function App() {
  const [solution, setSolution] = useState('');
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [usedKeys, setUsedKeys] = useState({});

  useEffect(() => {
    // შემთხვევითი სიტყვა
    setSolution(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }, []);

  useEffect(() => {
    const handleKeyup = (event) => {
      onKey(event.key);
    };
    window.addEventListener('keyup', handleKeyup);
    return () => window.removeEventListener('keyup', handleKeyup);
    // eslint-disable-next-line
  }, [currentGuess, guesses, turn, isCorrect, usedKeys, solution]);

  function onKey(key) {
    key = key.toLowerCase();
    if (isCorrect || turn >= 6) return;

    if (key === 'enter') {
      if (currentGuess.length !== 5) return;
      if (history.includes(currentGuess)) {
        alert('You already tried this word!');
        return;
      }
      if (!WORDS.includes(currentGuess)) {
        alert('Not in word list!');
        return;
      }
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setHistory([...history, currentGuess]);
      setTurn(turn + 1);

      // ასოების სტატუსების განახლება კლავიატურაზე
      const newUsed = { ...usedKeys };
      for (let i = 0; i < 5; i++) {
        const letter = currentGuess[i];
        if (solution[i] === letter) newUsed[letter] = 'correct';
        else if (solution.includes(letter)) {
          if (newUsed[letter] !== 'correct') newUsed[letter] = 'present';
        } else {
          newUsed[letter] = 'absent';
        }
      }
      setUsedKeys(newUsed);

      if (currentGuess === solution) setIsCorrect(true);
      setCurrentGuess('');
      return;
    }

    if (key === 'backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (/^[a-z]$/.test(key)) {
      if (currentGuess.length < 5) {
        setCurrentGuess(prev => prev + key);
      }
    }
  }

  // გიდი
  function renderGrid() {
  const rows = [];
  for (let i = 0; i < 1; i++) {
    let cells = [];
    if (i < guesses.length) {
      for (let j = 0; j < 5; j++) {
        const letter = guesses[i][j] || '';
        const status = getCellStatus(letter, solution, j, guesses[i]);
        cells.push(
          <div className={`cell ${status}`} key={j}>{letter}</div>
        );
      }
    } else if (i === guesses.length) {
      for (let j = 0; j < 5; j++) {
        const letter = currentGuess[j] || '';
        let status = '';
        if (letter) {
          if (solution[j] === letter) status = 'correct';
          else if (!solution.includes(letter)) status = 'absent';
        }
        cells.push(
          <div className={`cell ${status}`} key={j}>{letter}</div>
        );
      }
    } else {
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

  // ეკრანის კლავიატურა
  function renderKeyboard() {
    return (
      <div className="keyboard">
        {KEYS.map((row, i) => (
          <div className="kb-row" key={i}>
            {i === 2 && (
              <button className="kb-btn wide" onClick={() => onKey('enter')}>Enter</button>
            )}
            {row.map((k) => (
              <button
                className={`kb-btn ${usedKeys[k] || ''}`}
                key={k}
                onClick={() => onKey(k)}
                disabled={isCorrect || turn >= 6}
              >
                {k}
              </button>
            ))}
            {i === 2 && (
              <button className="kb-btn wide" onClick={() => onKey('backspace')}>⌫</button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1>Wordle</h1>
      {renderGrid()}
      {renderKeyboard()}
      {isCorrect && <div className="status" style={{color: 'green'}}>You Win!</div>}
      {turn >= 6 && !isCorrect && <div className="status" style={{color: 'red'}}>Game Over! Solution: {solution}</div>}
      <style>{`
        body {
          background: #121213;
          color: #fff;
          font-family: 'Segoe UI', Arial, sans-serif;
          min-height: 100vh;
          margin: 0;
        }
        h1 {
          text-align: center;
          letter-spacing: 2px;
          margin-top: 30px;
          color: #6aaa64;
        }
        .grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 220px;
          margin: 30px auto;
        }
        .row {
          display: flex;
          gap: 5px;
        }
        .cell {
          width: 40px;
          height: 40px;
          border: 2px solid #3a3a3c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #1a1a1b;
          text-transform: uppercase;
          font-weight: bold;
          border-radius: 5px;
          transition: background 0.2s, border 0.2s;
        }
        .cell.correct {
  background: #6aaa64;
  border-color: #6aaa64;
  color: #fff;
}
        .cell.present {
          background: #c9b458;
          border-color: #c9b458;
          color: #fff;
        }
        .cell.absent {
  background: #c0392b;
  border-color: #c0392b;
  color: #fff;
}
        .status {
          text-align: center;
          font-size: 1.2rem;
          margin-top: 20px;
        }
        .keyboard {
          width: 320px;
          margin: 30px auto 0;
          user-select: none;
        }
        .kb-row {
          display: flex;
          justify-content: center;
          margin-bottom: 8px;
        }
        .kb-btn {
          margin: 2px;
          padding: 0;
          width: 32px;
          height: 44px;
          border: none;
          border-radius: 4px;
          background: #818384;
          color: #fff;
          font-size: 1.1rem;
          font-weight: bold;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
        }
        .kb-btn.correct {
          background: #6aaa64;
        }
        .kb-btn.present {
          background: #c9b458;
        }
        .kb-btn.absent {
          background: #3a3a3c;
        }
        .kb-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .kb-btn.wide {
          width: 56px;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

export default App;