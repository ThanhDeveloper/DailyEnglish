import { useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { MicIcon, VolumeIcon, CheckIcon, XIcon, RefreshIcon } from './Icons';
import styles from './SpeakingPractice.module.css';

interface SpeakingPracticeProps {
  words: { word: string; ipa: string; meaning: string }[];
}

export function SpeakingPractice({ words }: SpeakingPracticeProps) {
  const { speakText, listen, isListening, canSpeak, canListen } = useSpeech();
  const [current, setCurrent] = useState(0);
  const [spoken, setSpoken] = useState('');
  const [match, setMatch] = useState<boolean | null>(null);

  if (!canSpeak || !canListen) {
    return (
      <div className={styles.unsupported}>
        <p>Speech features are not supported in your browser.</p>
        <p>Please try Chrome or Edge for the best experience.</p>
      </div>
    );
  }

  const w = words[current];

  async function handleListen() {
    const res = await listen();
    if (res) {
      setSpoken(res.transcript);
      const isMatch =
        res.transcript.toLowerCase().trim() === w.word.toLowerCase().trim();
      setMatch(isMatch);
    }
  }

  function next() {
    setCurrent((c) => (c + 1) % words.length);
    setSpoken('');
    setMatch(null);
  }

  return (
    <div className={styles.container}>
      <div className={styles.wordDisplay}>
        <h3 className={styles.word}>{w.word}</h3>
        <p className={styles.ipa}>{w.ipa}</p>
        <p className={styles.meaning}>{w.meaning}</p>
      </div>

      <div className={styles.controls}>
        <button
          className={`btn btn-outline ${styles.listenBtn}`}
          onClick={() => speakText(w.word)}
        >
          <VolumeIcon size={18} /> Listen
        </button>
        <button
          className={`btn btn-primary ${styles.micBtn} ${isListening ? styles.listening : ''}`}
          onClick={handleListen}
          disabled={isListening}
        >
          <MicIcon size={18} /> {isListening ? 'Listening...' : 'Speak'}
        </button>
      </div>

      {spoken && (
        <div className={`${styles.feedback} ${match ? styles.correct : styles.wrong}`}>
          <span className={styles.feedbackIcon}>
            {match ? <CheckIcon size={20} /> : <XIcon size={20} />}
          </span>
          <div>
            <p className={styles.feedbackText}>
              You said: "<strong>{spoken}</strong>"
            </p>
            <p>{match ? 'Correct! Well done!' : `Try again. The word is "${w.word}".`}</p>
          </div>
        </div>
      )}

      <button className="btn btn-outline" onClick={next}>
        <RefreshIcon size={16} /> Next Word
      </button>
    </div>
  );
}
