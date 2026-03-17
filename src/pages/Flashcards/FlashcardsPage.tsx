import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FlashCard } from '../../components/FlashCard';
import { ArrowLeftIcon } from '../../components/Icons';
import { getFlashcardSet, getTopic } from '../../utils/content';
import { useProgress } from '../../hooks/useProgress';
import type { FlashcardItem, VocabularyWord } from '../../types';
import styles from './FlashcardsPage.module.css';

export function FlashcardsPage() {
  const { id, topicId } = useParams<{ id?: string; topicId?: string }>();
  const [cards, setCards] = useState<(FlashcardItem | VocabularyWord)[]>([]);
  const [title, setTitle] = useState('');
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const setId = id ?? `topic-${topicId}`;

  const { markFlashcard, getFlashcardProgress } = useProgress();

  useEffect(() => {
    if (topicId) {
      getTopic(topicId).then((t) => {
        setCards(t.vocabulary);
        setTitle(`${t.title} Flashcards`);
        setLoading(false);
      });
    } else if (id === 'saved-words') {
      // Load saved words from progress
      const raw = localStorage.getItem('dailyenglish_progress');
      const saved = raw ? (JSON.parse(raw).savedWords ?? []) : [];
      setCards(saved.map((w: { word: string; ipa: string; meaning: string; example: string }) => ({
        word: w.word, ipa: w.ipa, meaning: w.meaning, example: w.example,
      })));
      setTitle('My Saved Words');
      setLoading(false);
    } else if (id) {
      getFlashcardSet(id).then((s) => {
        setCards(s.cards);
        setTitle(s.title);
        setLoading(false);
      });
    }
  }, [id, topicId]);

  // Mark card as studied when viewed
  useEffect(() => {
    if (cards.length > 0) {
      markFlashcard(setId, idx);
    }
  }, [idx, cards.length, setId, markFlashcard]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  const card = cards[idx];
  const prog = getFlashcardProgress(setId, cards.length);

  return (
    <div className="page-enter">
      <Link to={topicId ? `/topic/${topicId}` : '/'} className={styles.back}>
        <ArrowLeftIcon size={18} /> Back
      </Link>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${prog.percent}%` }} />
      </div>
      <p className={styles.counter}>
        {idx + 1} / {cards.length}
        <span className={styles.progressLabel}>{prog.studied} studied ({prog.percent}%)</span>
      </p>

      <div className={styles.cardArea}>
        <FlashCard
          word={card.word}
          ipa={card.ipa}
          meaning={card.meaning}
          example={card.example}
          image={'image' in card ? card.image : undefined}
        />
      </div>

      <div className={styles.nav}>
        <button
          className="btn btn-outline"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
        >
          Previous
        </button>
        <button
          className="btn btn-outline"
          onClick={() => setIdx((i) => Math.min(cards.length - 1, i + 1))}
          disabled={idx === cards.length - 1}
        >
          Next
        </button>
      </div>

      {prog.percent === 100 && (
        <div className={styles.complete}>
          All {cards.length} cards studied! Great job.
        </div>
      )}
    </div>
  );
}
