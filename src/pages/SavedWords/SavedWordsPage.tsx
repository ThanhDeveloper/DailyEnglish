import { Link } from 'react-router-dom';
import { WordCard } from '../../components/WordCard';
import { ArrowLeftIcon, HeartFilledIcon, BookIcon } from '../../components/Icons';
import { useProgress } from '../../hooks/useProgress';
import styles from './SavedWordsPage.module.css';

export function SavedWordsPage() {
  const { progress } = useProgress();
  const saved = progress.savedWords ?? [];

  return (
    <div className="page-enter">
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon size={18} /> Back
      </Link>
      <div className={styles.header}>
        <HeartFilledIcon size={28} className={styles.headerIcon} />
        <div>
          <h1 className={styles.title}>My Saved Words</h1>
          <p className={styles.desc}>{saved.length} word{saved.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {saved.length > 0 && (
        <div className={styles.cta}>
          <Link to="/flashcards/saved-words" className="btn btn-primary">
            <BookIcon size={16} /> Study as Flashcards
          </Link>
        </div>
      )}

      {saved.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven't saved any words yet.</p>
          <p>Click the ❤️ on any word card in a topic to save it here.</p>
          <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>
            Browse Topics
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {saved.map((w) => (
            <WordCard
              key={w.word}
              word={w.word}
              ipa={w.ipa}
              meaning={w.meaning}
              translation=""
              example={w.example}
              source={w.source}
            />
          ))}
        </div>
      )}
    </div>
  );
}
