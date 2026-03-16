import { useState, useEffect } from 'react';
import type { Topic } from '../types';
import { getTopic } from '../utils/content';

export function useTopic(id: string | undefined) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getTopic(id)
      .then(setTopic)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { topic, loading, error };
}
