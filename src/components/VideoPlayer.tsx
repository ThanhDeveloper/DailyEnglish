import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
}

export function VideoPlayer({ youtubeId, title }: VideoPlayerProps) {
  return (
    <div className={styles.wrapper}>
      <iframe
        className={styles.iframe}
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
