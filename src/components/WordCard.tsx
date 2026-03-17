import { useState } from 'react';
import { VolumeIcon, HeartIcon, HeartFilledIcon, ChevronDownIcon } from './Icons';
import { speak } from '../utils/speech';
import { useProgress } from '../hooks/useProgress';
import type { SavedWord } from '../hooks/useProgress';
import styles from './WordCard.module.css';

interface WordCardProps {
  word: string;
  ipa: string;
  meaning: string;
  translation: string;
  example: string;
  image?: string;
  source?: string;
}

export function WordCard({ word, ipa, meaning, translation, example, image, source = '' }: WordCardProps) {
  const [showExample, setShowExample] = useState(false);
  const { saveWord, unsaveWord, isWordSaved } = useProgress();
  const saved = isWordSaved(word);

  function toggleSave() {
    if (saved) {
      unsaveWord(word);
    } else {
      const entry: SavedWord = { word, ipa, meaning, example, source };
      saveWord(entry);
    }
  }

  return (
    <div className={styles.card}>
      {image && (
        <img src={image} alt={word} className={styles.image} loading="lazy" />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.word}>{word}</h4>
          <div className={styles.actions}>
            <button
              className={styles.speakBtn}
              onClick={() => speak(word)}
              aria-label={`Pronounce ${word}`}
              title="Speak word"
            >
              <VolumeIcon size={15} />
            </button>
            <button
              className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
              onClick={toggleSave}
              aria-label={saved ? `Remove ${word} from saved` : `Save ${word}`}
              title={saved ? 'Remove from saved' : 'Save word'}
            >
              {saved ? <HeartFilledIcon size={15} /> : <HeartIcon size={15} />}
            </button>
          </div>
        </div>
        <div className={styles.ipaRow}>
          <p className={styles.ipa}>{ipa}</p>
          <button
            className={styles.ipaSpeak}
            onClick={() => speak(ipa, 0.65)}
            aria-label="Pronounce IPA"
            title="Hear IPA pronunciation"
          >
            <VolumeIcon size={12} />
          </button>
        </div>
        <p className={styles.meaning}>{meaning}</p>
        {translation && <p className={styles.translation}>{translation}</p>}
        <button
          className={styles.exampleToggle}
          onClick={() => setShowExample((v) => !v)}
          aria-expanded={showExample}
        >
          <ChevronDownIcon size={13} className={showExample ? styles.chevronOpen : ''} />
          {showExample ? 'Hide example' : 'Show example'}
        </button>
        {showExample && <p className={styles.example}>"{example}"</p>}
      </div>
    </div>
  );
}
