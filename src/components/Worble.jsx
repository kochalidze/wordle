import React, { useEffect } from 'react';
import useWordle from '../hooks/useWordle';
import Grid from './Grid';

function Worble({ solution }) {
  const { turn, currentGuess, guesses, isCorrect, handleKeyup } = useWordle(solution);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
    return () => window.removeEventListener('keyup', handleKeyup);
  }, [handleKeyup]);

  return (
    <div>
      <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} solution={solution} />
      {isCorrect && <div className="status" style={{color: 'green'}}>You Win!</div>}
      {turn >= 6 && !isCorrect && <div className="status" style={{color: 'red'}}>Game Over! Solution: {solution}</div>}
    </div>
  );
}

export default Worble;