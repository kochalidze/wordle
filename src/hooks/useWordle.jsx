import { useState } from 'react';

const useWordle = (solution) => {
  const [turn, setTurn] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [history, setHistory] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleKeyup = (event) => {
    const key = event.key.toLowerCase();

    if (key === 'enter') {
      if (currentGuess.length !== 5) return;
      if (history.includes(currentGuess)) {
        alert('You already tried this word!');
        return;
      }
      if (turn >= 6) return;

      setGuesses([...guesses, currentGuess]);
      setHistory([...history, currentGuess]);
      setTurn(turn + 1);

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
  };

  return { turn, currentGuess, guesses, isCorrect, handleKeyup };
};

export default useWordle;