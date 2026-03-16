import { VolumeIcon } from './Icons';
import { speak } from '../utils/speech';
import styles from './WordCard.module.css';

interface WordCardProps {
  word: string;
  ipa: string;
  meaning: string;
  translation: string;
  example: string;
  image?: string;
}

export function WordCard({ word, ipa, meaning, translation, example, image }: WordCardProps) {
  return (
    <div className={styles.card}>
      {image && (
        <img src={image} alt={word} className={styles.image} loading="lazy" />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.word}>{word}</h4>
          <button
            className={styles.speakBtn}
            onClick={() => speak(word)}
            aria-label={`Pronounce ${word}`}
          >
            <VolumeIcon size={16} />
          </button>
        </div>
        <p className={styles.ipa}>{ipa}</p>
        <p className={styles.meaning}>{meaning}</p>
        <p className={styles.translation}>{translation}</p>
        <p className={styles.example}>"{example}"</p>
      </div>
    </div>
  );
}
