import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PodcastPlayer } from '../../components/PodcastPlayer';
import { ArrowLeftIcon, HeadphonesIcon } from '../../components/Icons';
import { getContentIndex, getPodcast } from '../../utils/content';
import type { PodcastSeries } from '../../types';
import styles from './PodcastPage.module.css';

export function PodcastPage() {
  const [series, setSeries] = useState<PodcastSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentIndex().then(async (idx) => {
      const all = await Promise.all(idx.podcasts.map((p) => getPodcast(p.id)));
      setSeries(all);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div className="page-enter">
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon size={18} /> Back
      </Link>
      <div className={styles.header}>
        <HeadphonesIcon size={32} />
        <div>
          <h1 className={styles.title}>Podcasts</h1>
          <p className={styles.desc}>Listen to English lessons with transcripts</p>
        </div>
      </div>

      {series.map((s) => (
        <div key={s.id} className={styles.section}>
          <h2 className={styles.seriesTitle}>{s.title}</h2>
          <p className={styles.seriesDesc}>{s.description}</p>
          <div className={styles.episodes}>
            {s.episodes.map((ep) => (
              <PodcastPlayer key={ep.id} episode={ep} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
