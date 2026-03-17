import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DialoguePractice } from '../../components/DialoguePractice';
import { ArrowLeftIcon, MessageCircleIcon, ChevronDownIcon } from '../../components/Icons';
import { getContentIndex, getConversation } from '../../utils/content';
import { useProgress } from '../../hooks/useProgress';
import type { ConversationSet } from '../../types';
import styles from './ConversationPage.module.css';

const LEVEL_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export function ConversationPage() {
  const [sets, setSets] = useState<ConversationSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { markConversationDone, getConversationProgress } = useProgress();

  useEffect(() => {
    getContentIndex().then(async (idx) => {
      const all = await Promise.all(idx.conversations.map((c) => getConversation(c.id)));
      setSets(all);
      // Auto-expand first set
      if (all.length > 0) {
        setExpanded({ [all[0].id]: true });
      }
      setLoading(false);
    });
  }, []);

  const filteredSets = useMemo(() => {
    return sets.filter((s) => {
      const matchSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.dialogues.some((d) => d.title.toLowerCase().includes(search.toLowerCase()));
      const matchFilter =
        filter === 'All' ||
        s.dialogues.some((d) =>
          ('level' in d ? (d as { level?: string }).level ?? '' : '').toLowerCase() ===
          filter.toLowerCase()
        ) ||
        s.title.toLowerCase().includes(filter.toLowerCase()) ||
        s.description.toLowerCase().includes(filter.toLowerCase());
      return matchSearch && matchFilter;
    });
  }, [sets, filter, search]);

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

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

      <div className={styles.controls}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {LEVEL_FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredSets.length === 0 && (
        <p className={styles.empty}>No conversations found. Try a different search or filter.</p>
      )}

      <div className={styles.list}>
        {filteredSets.map((set) => {
          const isOpen = !!expanded[set.id];
          const prog = getConversationProgress(set.id, set.dialogues.length);
          return (
            <div key={set.id} className={styles.section}>
              <button
                className={styles.sectionHeader}
                onClick={() => toggle(set.id)}
                aria-expanded={isOpen}
              >
                <div className={styles.sectionMeta}>
                  <h2 className={styles.setTitle}>{set.title}</h2>
                  <p className={styles.setDesc}>{set.description}</p>
                  {prog.done > 0 && (
                    <div className={styles.progRow}>
                      <div className={styles.miniBar}>
                        <div className={styles.miniBarFill} style={{ width: `${prog.percent}%` }} />
                      </div>
                      <span className={styles.progLabel}>{prog.done}/{prog.total} done</span>
                    </div>
                  )}
                </div>
                <ChevronDownIcon
                  size={20}
                  className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                />
              </button>
              {isOpen && (
                <div className={styles.dialogues}>
                  {set.dialogues.map((d) => (
                    <DialoguePractice
                      key={d.id}
                      dialogue={d}
                      onComplete={() => markConversationDone(set.id, d.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
