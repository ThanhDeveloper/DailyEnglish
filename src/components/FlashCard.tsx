import { useState, useRef } from 'react';
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
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const isTouchRef = useRef(false);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const delta = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    touchStartY.current = null;
    // Only flip if touch moved less than 10px (a tap, not a scroll)
    if (delta < 10) {
      isTouchRef.current = true;
      setFlipped((f) => !f);
    }
  };

  const handleClick = () => {
    // Skip click event if already handled by touch
    if (isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }
    setFlipped((f) => !f);
  };

  return (
    <div
      className={`${styles.card} ${flipped ? styles.flipped : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped(!flipped)}
    >
      <div className={styles.inner}>
        <div className={styles.front}>
          {image && (
            <img src={image} alt={word} className={styles.image} loading="lazy" />
          )}
          <h3 className={styles.word}>{word}</h3>
          <p className={styles.ipa}>{ipa}</p>
          <button
            className={`btn-icon ${styles.speakBtn}`}
            onClick={(e) => { e.stopPropagation(); speak(word); }}
            aria-label={`Pronounce ${word}`}
          >
            <VolumeIcon size={18} />
          </button>
          <p className={styles.hint}>Tap to see meaning</p>
        </div>
        <div className={styles.back}>
          <h3 className={styles.word}>{word}</h3>
          <p className={styles.meaning}>{meaning}</p>
          <p className={styles.example}>"{example}"</p>
          <button
            className={`btn-icon ${styles.speakBtn}`}
            onClick={(e) => { e.stopPropagation(); speak(example, 0.85); }}
            aria-label="Pronounce example"
          >
            <VolumeIcon size={18} />
          </button>
          <p className={styles.hint}>Tap to flip back</p>
        </div>
      </div>
    </div>
  );
}
