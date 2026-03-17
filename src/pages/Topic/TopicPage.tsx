import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTopic } from '../../hooks/useTopic';
import { useProgress } from '../../hooks/useProgress';
import { VideoPlayer } from '../../components/VideoPlayer';
import { WordCard } from '../../components/WordCard';
import { Quiz } from '../../components/Quiz';
import { SpeakingPractice } from '../../components/SpeakingPractice';
import { TypingPractice } from '../../components/TypingPractice';
import { FlashCard } from '../../components/FlashCard';
import { ArrowLeftIcon, BookIcon } from '../../components/Icons';
import styles from './TopicPage.module.css';

type Tab = 'vocabulary' | 'video' | 'flashcards' | 'quiz' | 'speaking' | 'typing';

const TAB_ICONS: Record<Tab, string> = {
  vocabulary: '📖',
  video: '🎬',
  flashcards: '🃏',
  quiz: '✏️',
  speaking: '🎤',
  typing: '⌨️',
};

type WordFilter = 'all' | 'saved';

export function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const { topic, loading, error } = useTopic(id);
  const [tab, setTab] = useState<Tab>('vocabulary');
  const [cardIdx, setCardIdx] = useState(0);
  const [wordFilter, setWordFilter] = useState<WordFilter>('all');
  const { isWordSaved } = useProgress();

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (error || !topic) return <div className="loading"><p>Topic not found.</p></div>;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'vocabulary', label: 'Words' },
    { key: 'video', label: 'Video' },
    { key: 'flashcards', label: 'Cards' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'speaking', label: 'Speak' },
    { key: 'typing', label: 'Type' },
  ];

  return (
    <div className="page-enter">
      <div className={styles.header}>
        <Link to="/" className={styles.back}>
          <ArrowLeftIcon size={18} /> Back
        </Link>
        <div>
          <h1 className={styles.title} style={{ color: topic.color }}>{topic.title}</h1>
          <p className={styles.desc}>{topic.description}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.active : ''}`}
            onClick={() => setTab(t.key)}
          >
            <span className={styles.tabIcon}>{TAB_ICONS[t.key]}</span>
            <span className={styles.tabLabel}>{t.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'vocabulary' && (
          <>
            <div className={styles.wordFilters}>
              <button
                className={`${styles.wordFilterBtn} ${wordFilter === 'all' ? styles.wordFilterActive : ''}`}
                onClick={() => setWordFilter('all')}
              >
                All ({topic.vocabulary.length})
              </button>
              <button
                className={`${styles.wordFilterBtn} ${wordFilter === 'saved' ? styles.wordFilterActive : ''}`}
                onClick={() => setWordFilter('saved')}
              >
                ❤️ Saved ({topic.vocabulary.filter((w) => isWordSaved(w.word)).length})
              </button>
            </div>
            <div className={styles.wordList}>
              {topic.vocabulary
                .filter((w) => wordFilter === 'all' || isWordSaved(w.word))
                .map((w, i) => (
                  <WordCard key={i} {...w} source={topic.id} />
                ))}
              {wordFilter === 'saved' && topic.vocabulary.filter((w) => isWordSaved(w.word)).length === 0 && (
                <p className={styles.emptyFilter}>No saved words yet. Click the ❤️ on any word to save it.</p>
              )}
            </div>
          </>
        )}

        {tab === 'video' && (
          <div className={styles.videoSection}>
            <VideoPlayer youtubeId={topic.video.youtubeId} title={topic.video.title} />
            <p className={styles.videoTitle}>
              {topic.video.title} ({topic.video.duration})
            </p>
          </div>
        )}

        {tab === 'flashcards' && (
          <div className={styles.flashcardSection}>
            <FlashCard
              word={topic.vocabulary[cardIdx].word}
              ipa={topic.vocabulary[cardIdx].ipa}
              meaning={topic.vocabulary[cardIdx].meaning}
              example={topic.vocabulary[cardIdx].example}
              image={topic.vocabulary[cardIdx].image}
            />
            <div className={styles.cardNav}>
              <button
                className="btn btn-outline"
                onClick={() => setCardIdx((i) => Math.max(0, i - 1))}
                disabled={cardIdx === 0}
              >
                Previous
              </button>
              <span className={styles.cardCount}>
                {cardIdx + 1} / {topic.vocabulary.length}
              </span>
              <button
                className="btn btn-outline"
                onClick={() => setCardIdx((i) => Math.min(topic.vocabulary.length - 1, i + 1))}
                disabled={cardIdx === topic.vocabulary.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {tab === 'quiz' && <Quiz questions={topic.quiz} topicTitle={topic.title} />}

        {tab === 'speaking' && <SpeakingPractice words={topic.vocabulary} />}

        {tab === 'typing' && <TypingPractice words={topic.vocabulary} />}
      </div>

      {tab === 'vocabulary' && (
        <div className={styles.bottomCta}>
          <Link to={`/flashcards/topic/${topic.id}`} className="btn btn-primary">
            <BookIcon size={18} /> Practice with Flashcards
          </Link>
        </div>
      )}
    </div>
  );
}
