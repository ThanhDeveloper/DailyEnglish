import { Link } from 'react-router-dom';
import { DynamicIcon } from './Icons';
import styles from './TopicCard.module.css';

interface TopicCardProps {
  id: string;
  title: string;
  icon: string;
  color: string;
  description?: string;
  vocabCount?: number;
}

export function TopicCard({ id, title, icon, color, description, vocabCount }: TopicCardProps) {
  return (
    <Link to={`/topic/${id}`} className={styles.card}>
      <div className={styles.iconWrap} style={{ backgroundColor: `${color}15` }}>
        <span style={{ color }}>
          <DynamicIcon name={icon} size={32} />
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.desc}>{description}</p>}
        {vocabCount !== undefined && (
          <span className={styles.count}>{vocabCount} words</span>
        )}
      </div>
    </Link>
  );
}
