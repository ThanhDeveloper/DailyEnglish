import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TopicCard } from '../../components/TopicCard';
import { SearchIcon, BookIcon, HeadphonesIcon, MessageCircleIcon, MicIcon } from '../../components/Icons';
import { getContentIndex, getAllTopics } from '../../utils/content';
import type { ContentIndex, Topic } from '../../types';
import styles from './HomePage.module.css';

export function HomePage() {
  const [index, setIndex] = useState<ContentIndex | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    getContentIndex().then(setIndex);
    getAllTopics().then(setTopics);
  }, []);

  if (!index) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <div className="page-enter">
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Learn English <span className={styles.accent}>Every Day</span>
        </h1>
        <p className={styles.heroDesc}>
          Practice vocabulary, listening, speaking, and more with topic-based lessons
        </p>
        <div className={styles.heroActions}>
          <Link to="/search" className="btn btn-primary">
            <SearchIcon size={18} /> Search Words
          </Link>
          <Link to="/flashcards/core-vocab" className="btn btn-outline">
            <BookIcon size={18} /> Flashcards
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Topics</h2>
        <div className="grid grid-2">
          {topics.map((t) => (
            <TopicCard
              key={t.id}
              id={t.id}
              title={t.title}
              icon={t.icon}
              color={t.color}
              description={t.description}
              vocabCount={t.vocabulary.length}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Quick Access</h2>
        <div className="grid grid-3">
          <Link to="/podcasts" className={styles.quickCard}>
            <HeadphonesIcon size={28} />
            <div>
              <h3>Podcasts</h3>
              <p>Listen and learn with transcripts</p>
            </div>
          </Link>
          <Link to="/conversations" className={styles.quickCard}>
            <MessageCircleIcon size={28} />
            <div>
              <h3>Conversations</h3>
              <p>Practice real dialogues</p>
            </div>
          </Link>
          <Link to="/search" className={styles.quickCard}>
            <MicIcon size={28} />
            <div>
              <h3>Speaking</h3>
              <p>Practice pronunciation</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
