import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DialoguePractice } from '../../components/DialoguePractice';
import { ArrowLeftIcon, MessageCircleIcon } from '../../components/Icons';
import { getContentIndex, getConversation } from '../../utils/content';
import type { ConversationSet } from '../../types';
import styles from './ConversationPage.module.css';

export function ConversationPage() {
  const [sets, setSets] = useState<ConversationSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContentIndex().then(async (idx) => {
      const all = await Promise.all(idx.conversations.map((c) => getConversation(c.id)));
      setSets(all);
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
        <MessageCircleIcon size={32} />
        <div>
          <h1 className={styles.title}>Conversations</h1>
          <p className={styles.desc}>Practice real-life English dialogues</p>
        </div>
      </div>

      {sets.map((set) => (
        <div key={set.id} className={styles.section}>
          <h2 className={styles.setTitle}>{set.title}</h2>
          <p className={styles.setDesc}>{set.description}</p>
          <div className={styles.dialogues}>
            {set.dialogues.map((d) => (
              <DialoguePractice key={d.id} dialogue={d} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
