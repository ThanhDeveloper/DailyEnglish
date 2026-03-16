import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FlashCard } from '../../components/FlashCard';
import { ArrowLeftIcon } from '../../components/Icons';
import { getFlashcardSet, getTopic } from '../../utils/content';
import type { FlashcardItem, VocabularyWord } from '../../types';
import styles from './FlashcardsPage.module.css';

export function FlashcardsPage() {
  const { id, topicId } = useParams<{ id?: string; topicId?: string }>();
  const [cards, setCards] = useState<(FlashcardItem | VocabularyWord)[]>([]);
  const [title, setTitle] = useState('');
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicId) {
      getTopic(topicId).then((t) => {
        setCards(t.vocabulary);
        setTitle(`${t.title} Flashcards`);
        setLoading(false);
      });
    } else if (id) {
      getFlashcardSet(id).then((s) => {
        setCards(s.cards);
        setTitle(s.title);
        setLoading(false);
      });
    }
  }, [id, topicId]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  const card = cards[idx];

  return (
    <div className="page-enter">
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon size={18} /> Back
      </Link>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.counter}>{idx + 1} of {cards.length}</p>

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
    </div>
  );
}
