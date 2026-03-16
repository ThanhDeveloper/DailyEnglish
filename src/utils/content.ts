import type {
  Topic,
  PodcastSeries,
  ConversationSet,
  FlashcardSet,
  ContentIndex,
} from '../types';

const contentCache = new Map<string, unknown>();

async function fetchJSON<T>(path: string): Promise<T> {
  if (contentCache.has(path)) {
    return contentCache.get(path) as T;
  }
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const data = await res.json();
  contentCache.set(path, data);
  return data as T;
}

export async function getContentIndex(): Promise<ContentIndex> {
  return fetchJSON<ContentIndex>('/content/index.json');
}

export async function getTopic(id: string): Promise<Topic> {
  const safeId = id.replace(/[^a-z0-9-]/gi, '');
  return fetchJSON<Topic>(`/content/topics/${safeId}.json`);
}

export async function getAllTopics(): Promise<Topic[]> {
  const index = await getContentIndex();
  return Promise.all(index.topics.map((t) => getTopic(t.id)));
}

export async function getPodcast(id: string): Promise<PodcastSeries> {
  const safeId = id.replace(/[^a-z0-9-]/gi, '');
  return fetchJSON<PodcastSeries>(`/content/podcasts/${safeId}.json`);
}

export async function getConversation(id: string): Promise<ConversationSet> {
  const safeId = id.replace(/[^a-z0-9-]/gi, '');
  return fetchJSON<ConversationSet>(`/content/conversations/${safeId}.json`);
}

export async function getFlashcardSet(id: string): Promise<FlashcardSet> {
  const safeId = id.replace(/[^a-z0-9-]/gi, '');
  return fetchJSON<FlashcardSet>(`/content/flashcards/${safeId}.json`);
}
