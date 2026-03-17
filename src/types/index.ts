export interface VocabularyWord {
  word: string;
  ipa: string;
  meaning: string;
  translation: string;
  example: string;
  image?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export interface TopicVideo {
  title: string;
  youtubeId: string;
  duration: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  video: TopicVideo;
  vocabulary: VocabularyWord[];
  quiz: QuizQuestion[];
}

export interface TranscriptLine {
  time: string;
  text: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  level: string;
  transcript: TranscriptLine[];
}

export interface PodcastSeries {
  id: string;
  title: string;
  description: string;
  episodes: PodcastEpisode[];
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface Dialogue {
  id: string;
  title: string;
  speakers: string[];
  lines: DialogueLine[];
}

export interface ConversationSet {
  id: string;
  title: string;
  description: string;
  dialogues: Dialogue[];
}

export interface FlashcardItem {
  word: string;
  ipa: string;
  meaning: string;
  example: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  cards: FlashcardItem[];
}

export interface ContentIndex {
  topics: { id: string; title: string; icon: string; color: string }[];
  podcasts: { id: string; title: string }[];
  conversations: { id: string; title: string }[];
  flashcardSets: { id: string; title: string; level?: string }[];
}
