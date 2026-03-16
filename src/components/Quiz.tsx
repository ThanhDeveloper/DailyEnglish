import { useState } from 'react';
import type { QuizQuestion } from '../types';
import { CheckIcon, XIcon, RefreshIcon } from './Icons';
import styles from './Quiz.module.css';

interface QuizProps {
  questions: QuizQuestion[];
  topicTitle: string;
}

export function Quiz({ questions, topicTitle }: QuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className={styles.result}>
        <h3>Quiz Complete!</h3>
        <p className={styles.score}>
          {score} / {questions.length} ({pct}%)
        </p>
        <p className={styles.message}>
          {pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good job! Keep practicing.' : 'Keep learning and try again!'}
        </p>
        <button className="btn btn-primary" onClick={restart}>
          <RefreshIcon size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.quiz}>
      <div className={styles.progress}>
        <span>{topicTitle} Quiz</span>
        <span>{current + 1} / {questions.length}</span>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>
      <h3 className={styles.question}>{q.question}</h3>
      <div className={styles.options}>
        {q.options.map((opt, idx) => {
          let cls = styles.option;
          if (selected !== null) {
            if (idx === q.answer) cls += ` ${styles.correct}`;
            else if (idx === selected) cls += ` ${styles.wrong}`;
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <span className={styles.optionLabel}>{String.fromCharCode(65 + idx)}</span>
              {opt}
              {selected !== null && idx === q.answer && <CheckIcon size={16} />}
              {selected !== null && idx === selected && idx !== q.answer && <XIcon size={16} />}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button className="btn btn-primary" onClick={handleNext}>
          {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
