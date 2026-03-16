import type { VocabularyWord, Topic } from '../types';

export interface SearchResult {
  word: VocabularyWord;
  topicId: string;
  topicTitle: string;
  score: number;
}

export function searchVocabulary(
  topics: Topic[],
  query: string
): SearchResult[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const topic of topics) {
    for (const word of topic.vocabulary) {
      let score = 0;
      const w = word.word.toLowerCase();
      const m = word.meaning.toLowerCase();
      const t = word.translation.toLowerCase();

      if (w === q) score = 100;
      else if (w.startsWith(q)) score = 80;
      else if (w.includes(q)) score = 60;
      else if (m.includes(q)) score = 40;
      else if (t.includes(q)) score = 30;
      else if (word.example.toLowerCase().includes(q)) score = 20;

      if (score > 0) {
        results.push({
          word,
          topicId: topic.id,
          topicTitle: topic.title,
          score,
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
