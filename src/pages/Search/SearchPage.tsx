import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { SearchIcon, VolumeIcon, ArrowLeftIcon } from '../../components/Icons';
import { speak } from '../../utils/speech';
import { getAllTopics } from '../../utils/content';
import type { Topic } from '../../types';
import styles from './SearchPage.module.css';

export function SearchPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { query, results, search, clear } = useSearch(topics);

  useEffect(() => {
    getAllTopics().then((t) => {
      setTopics(t);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page-enter">
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon size={18} /> Back
      </Link>
      <h1 className={styles.title}>Vocabulary Search</h1>
      <p className={styles.desc}>Search across all topics and words</p>

      <div className={styles.searchBar}>
        <SearchIcon size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          placeholder="Search words, meanings, translations..."
          className={styles.input}
          autoFocus
        />
        {query && (
          <button className={styles.clearBtn} onClick={clear}>
            Clear
          </button>
        )}
      </div>

      {query && (
        <p className={styles.resultCount}>
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
      )}

      <div className={styles.results}>
        {results.map((r, i) => (
          <div key={i} className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <h3 className={styles.word}>{r.word.word}</h3>
              <button
                className={styles.speakBtn}
                onClick={() => speak(r.word.word)}
                aria-label={`Pronounce ${r.word.word}`}
              >
                <VolumeIcon size={16} />
              </button>
            </div>
            <p className={styles.ipa}>{r.word.ipa}</p>
            <p className={styles.meaning}>{r.word.meaning}</p>
            <p className={styles.example}>"{r.word.example}"</p>
            <Link to={`/topic/${r.topicId}`} className={styles.topicLink}>
              {r.topicTitle}
            </Link>
          </div>
        ))}
      </div>

      {!query && (
        <div className={styles.suggestions}>
          <p>Try searching for:</p>
          <div className={styles.chips}>
            {['passport', 'reservation', 'deadline', 'emergency', 'greeting'].map((w) => (
              <button key={w} className={styles.chip} onClick={() => search(w)}>
                {w}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
