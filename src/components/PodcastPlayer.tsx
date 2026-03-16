import { useState } from 'react';
import type { PodcastEpisode } from '../types';
import { VideoPlayer } from './VideoPlayer';
import styles from './PodcastPlayer.module.css';

interface PodcastPlayerProps {
  episode: PodcastEpisode;
}

export function PodcastPlayer({ episode }: PodcastPlayerProps) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className={styles.player}>
      <VideoPlayer youtubeId={episode.youtubeId} title={episode.title} />
      <div className={styles.info}>
        <h3 className={styles.title}>{episode.title}</h3>
        <p className={styles.desc}>{episode.description}</p>
        <div className={styles.meta}>
          <span className="badge" style={{ background: episode.level === 'beginner' ? '#dcfce7' : '#dbeafe', color: episode.level === 'beginner' ? '#166534' : '#1e40af' }}>
            {episode.level}
          </span>
          <span className={styles.duration}>{episode.duration}</span>
        </div>
      </div>
      {episode.transcript.length > 0 && (
        <>
          <button
            className="btn btn-outline"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </button>
          {showTranscript && (
            <div className={styles.transcript}>
              {episode.transcript.map((line, i) => (
                <div key={i} className={styles.line}>
                  <span className={styles.time}>{line.time}</span>
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
