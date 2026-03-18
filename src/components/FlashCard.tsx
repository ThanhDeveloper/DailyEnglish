import { useState } from 'react';
import { VolumeIcon } from './Icons';
import { speak } from '../utils/speech';
import styles from './FlashCard.module.css';

interface FlashCardProps {
  word: string;
  ipa: string;
  meaning: string;
  example: string;
  image?: string;
}

export function FlashCard({ word, ipa, meaning, example, image }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
      <div className={styles.inner}>
        <div className={styles.front}>
          {image && (
            <img src={image} alt={word} className={styles.image} loading="lazy" />
          )}
          <h3 className={styles.word}>{word}</h3>
          <p className={styles.ipa}>{ipa}</p>
          <button
            className={`btn-icon ${styles.speakBtn}`}
            onClick={() => speak(word)}
            aria-label={`Pronounce ${word}`}
          >
            <VolumeIcon size={18} />
          </button>
          <button
            className={`btn ${styles.flipBtn}`}
            onClick={() => setFlipped(true)}
          >
            See meaning
          </button>
        </div>
        <div className={styles.back}>
          <h3 className={styles.word}>{word}</h3>
          <p className={styles.meaning}>{meaning}</p>
          <p className={styles.example}>"{example}"</p>
          <button
            className={`btn-icon ${styles.speakBtn}`}
            onClick={() => speak(example, 0.85)}
            aria-label="Pronounce example"
          >
            <VolumeIcon size={18} />
          </button>
          <button
            className={`btn ${styles.flipBtn}`}
            onClick={() => setFlipped(false)}
          >
            Flip back
          </button>
        </div>
      </div>
    </div>
  );
}
