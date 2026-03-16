import { useState, useRef } from 'react';
import type { VocabularyWord } from '../types';
import { CheckIcon, XIcon, RefreshIcon } from './Icons';
import styles from './TypingPractice.module.css';

interface TypingPracticeProps {
  words: VocabularyWord[];
}

export function TypingPractice({ words }: TypingPracticeProps) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const w = words[current];

  function check() {
    const isCorrect = input.trim().toLowerCase() === w.word.toLowerCase();
    setCorrect(isCorrect);
    setChecked(true);
    setTotal((t) => t + 1);
    if (isCorrect) setScore((s) => s + 1);
  }

  function next() {
    setCurrent((c) => (c + 1) % words.length);
    setInput('');
    setChecked(false);
    inputRef.current?.focus();
  }

  return (
    <div className={styles.container}>
      <div className={styles.scoreBar}>
        <span>Score: {score}/{total}</span>
        <span>Word {current + 1} of {words.length}</span>
      </div>

      <div className={styles.prompt}>
        <p className={styles.meaning}>{w.meaning}</p>
        <p className={styles.ipa}>{w.ipa}</p>
      </div>

      <div className={styles.inputGroup}>
        <input
          ref={inputRef}
          type="text"
          className={`${styles.input} ${checked ? (correct ? styles.correct : styles.wrong) : ''}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (checked) next();
              else if (input.trim()) check();
            }
          }}
          placeholder="Type the word..."
          disabled={checked}
          autoFocus
        />
      </div>

      {checked && (
        <div className={`${styles.feedback} ${correct ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          {correct ? <CheckIcon size={18} /> : <XIcon size={18} />}
          <span>{correct ? 'Correct!' : `The answer is: ${w.word}`}</span>
        </div>
      )}

      <div className={styles.actions}>
        {!checked ? (
          <button className="btn btn-primary" onClick={check} disabled={!input.trim()}>
            Check
          </button>
        ) : (
          <button className="btn btn-primary" onClick={next}>
            <RefreshIcon size={16} /> Next
          </button>
        )}
      </div>
    </div>
  );
}
