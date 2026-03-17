import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getContentIndex, getFlashcardSet } from '../../utils/content';
import { useProgress } from '../../hooks/useProgress';
import { ArrowLeftIcon, BookIcon } from '../../components/Icons';
import styles from './FlashcardsListPage.module.css';

const LEVELS = ['All', 'A1', 'B1', 'B2', 'C1'];

interface SetInfo {
  id: string;
  title: string;
  level?: string;
  cardCount: number;
}

export function FlashcardsListPage() {
  const [sets, setSets] = useState<SetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('All');
  const { getFlashcardProgress } = useProgress();

  useEffect(() => {
    getContentIndex().then(async (idx) => {
      const details = await Promise.all(
        idx.flashcardSets.map(async (s) => {
          const data = await getFlashcardSet(s.id);
          return { id: s.id, title: s.title, level: s.level, cardCount: data.cards.length };
        })
      );
      setSets(details);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (levelFilter === 'All') return sets;
    return sets.filter((s) => s.level === levelFilter);
  }, [sets, levelFilter]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page-enter">
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon size={18} /> Back
      </Link>
      <div className={styles.header}>
        <BookIcon size={32} />
        <div>
          <h1 className={styles.title}>Flashcard Sets</h1>
          <p className={styles.desc}>Study vocabulary by level or topic</p>
        </div>
      </div>

      <div className={styles.filters}>
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`${styles.filterBtn} ${levelFilter === l ? styles.filterActive : ''}`}
            onClick={() => setLevelFilter(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((s) => {
          const prog = getFlashcardProgress(s.id, s.cardCount);
          return (
            <Link key={s.id} to={`/flashcards/${s.id}`} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.setTitle}>{s.title}</span>
                {s.level && <span className={styles.levelBadge}>{s.level}</span>}
              </div>
              <p className={styles.count}>{s.cardCount} cards</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${prog.percent}%` }} />
              </div>
              <p className={styles.progressLabel}>
                {prog.percent > 0 ? `${prog.percent}% studied` : 'Not started'}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
