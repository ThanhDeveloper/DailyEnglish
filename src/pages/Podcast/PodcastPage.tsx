import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VideoPlayer } from '../../components/VideoPlayer';
import { ArrowLeftIcon, HeadphonesIcon, PlayIcon } from '../../components/Icons';
import { getContentIndex, getPodcast } from '../../utils/content';
import type { PodcastSeries, PodcastEpisode } from '../../types';
import styles from './PodcastPage.module.css';

const LEVEL_COLOR: Record<string, { bg: string; text: string }> = {
  beginner:             { bg: '#dcfce7', text: '#166534' },
  intermediate:         { bg: '#dbeafe', text: '#1e40af' },
  'upper-intermediate': { bg: '#fef3c7', text: '#92400e' },
  advanced:             { bg: '#fce7f3', text: '#9d174d' },
};

function levelStyle(level: string) {
  const c = LEVEL_COLOR[level] ?? { bg: '#f3f4f6', text: '#374151' };
  return { background: c.bg, color: c.text };
}

export function PodcastPage() {
  const [series, setSeries] = useState<PodcastSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSeries, setActiveSeries] = useState<PodcastSeries | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    getContentIndex().then(async (idx) => {
      const all = await Promise.all(idx.podcasts.map((p) => getPodcast(p.id)));
      setSeries(all);
      setActiveSeries(all[0] ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  function selectSeries(s: PodcastSeries) {
    setActiveSeries(s);
    setActiveEpisode(null);
    setShowTranscript(false);
  }

  function selectEpisode(ep: PodcastEpisode) {
    setActiveEpisode(ep);
    setShowTranscript(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="page-enter">
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon size={18} /> Back
      </Link>

      <div className={styles.header}>
        <HeadphonesIcon size={28} />
        <div>
          <h1 className={styles.title}>Podcasts</h1>
          <p className={styles.desc}>Listen to English lessons with transcripts</p>
        </div>
      </div>

      {/* ── Series tabs — always visible on every screen ── */}
      <div className={styles.seriesTabs}>
        {series.map((s) => (
          <button
            key={s.id}
            className={`${styles.seriesTab} ${activeSeries?.id === s.id ? styles.seriesTabActive : ''}`}
            onClick={() => selectSeries(s)}
          >
            <span className={styles.seriesTabTitle}>{s.title}</span>
            <span className={styles.seriesTabCount}>{s.episodes.length} episodes</span>
          </button>
        ))}
      </div>

      {/* ── Episode grid view ── */}
      {activeSeries && !activeEpisode && (
        <>
          <div className={styles.seriesHeader}>
            <h2 className={styles.seriesTitle}>{activeSeries.title}</h2>
            <p className={styles.seriesDesc}>{activeSeries.description}</p>
          </div>

          <div className={styles.episodeGrid}>
            {activeSeries.episodes.map((ep, i) => (
              <button
                key={ep.id}
                className={styles.episodeCard}
                onClick={() => selectEpisode(ep)}
              >
                <div className={styles.episodeThumb}>
                  <img
                    src={`https://img.youtube.com/vi/${ep.youtubeId}/mqdefault.jpg`}
                    alt={ep.title}
                    className={styles.thumb}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className={styles.thumbOverlay}>
                    <PlayIcon size={28} />
                  </div>
                  <span className={styles.episodeNum}>#{i + 1}</span>
                </div>
                <div className={styles.episodeInfo}>
                  <h3 className={styles.episodeTitle}>{ep.title}</h3>
                  <p className={styles.episodeDesc}>{ep.description}</p>
                  <div className={styles.episodeMeta}>
                    <span className="badge" style={levelStyle(ep.level)}>{ep.level}</span>
                    <span className={styles.duration}>{ep.duration}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Player view ── */}
      {activeSeries && activeEpisode && (
        <div className={styles.player}>
          <button
            className={styles.backToList}
            onClick={() => { setActiveEpisode(null); setShowTranscript(false); }}
          >
            ← Back to {activeSeries.title}
          </button>

          <VideoPlayer youtubeId={activeEpisode.youtubeId} title={activeEpisode.title} />

          <div className={styles.playerInfo}>
            <div className={styles.playerMeta}>
              <span className="badge" style={levelStyle(activeEpisode.level)}>{activeEpisode.level}</span>
              <span className={styles.duration}>{activeEpisode.duration}</span>
            </div>
            <h2 className={styles.playerTitle}>{activeEpisode.title}</h2>
            <p className={styles.playerDesc}>{activeEpisode.description}</p>
          </div>

          {activeEpisode.transcript.length > 0 && (
            <>
              <button
                className="btn btn-outline"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
              </button>
              {showTranscript && (
                <div className={styles.transcript}>
                  {activeEpisode.transcript.map((line, i) => (
                    <div key={i} className={styles.line}>
                      <span className={styles.time}>{line.time}</span>
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Quick episode switcher */}
          <div className={styles.episodeNav}>
            <p className={styles.episodeNavTitle}>All episodes</p>
            <div className={styles.episodeNavList}>
              {activeSeries.episodes.map((ep, i) => (
                <button
                  key={ep.id}
                  className={`${styles.episodeNavItem} ${ep.id === activeEpisode.id ? styles.episodeNavItemActive : ''}`}
                  onClick={() => selectEpisode(ep)}
                >
                  <span className={styles.episodeNavLabel}>#{i + 1} {ep.title}</span>
                  <span className={styles.duration}>{ep.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
