import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './layout';

const HomePage = lazy(() =>
  import('../pages/Home/HomePage').then((m) => ({ default: m.HomePage }))
);
const TopicPage = lazy(() =>
  import('../pages/Topic/TopicPage').then((m) => ({ default: m.TopicPage }))
);
const FlashcardsPage = lazy(() =>
  import('../pages/Flashcards/FlashcardsPage').then((m) => ({ default: m.FlashcardsPage }))
);
const FlashcardsListPage = lazy(() =>
  import('../pages/Flashcards/FlashcardsListPage').then((m) => ({ default: m.FlashcardsListPage }))
);
const SavedWordsPage = lazy(() =>
  import('../pages/SavedWords/SavedWordsPage').then((m) => ({ default: m.SavedWordsPage }))
);
const PodcastPage = lazy(() =>
  import('../pages/Podcast/PodcastPage').then((m) => ({ default: m.PodcastPage }))
);
const ConversationPage = lazy(() =>
  import('../pages/Conversation/ConversationPage').then((m) => ({ default: m.ConversationPage }))
);
const SearchPage = lazy(() =>
  import('../pages/Search/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const GrammarPage = lazy(() =>
  import('../pages/Grammar/GrammarPage').then((m) => ({ default: m.GrammarPage }))
);

function Loading() {
  return (
    <div className="loading">
      <div className="spinner" />
    </div>
  );
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <SuspenseWrap><HomePage /></SuspenseWrap>,
      },
      {
        path: 'topic/:id',
        element: <SuspenseWrap><TopicPage /></SuspenseWrap>,
      },
      {
        path: 'flashcards',
        element: <SuspenseWrap><FlashcardsListPage /></SuspenseWrap>,
      },
      {
        path: 'flashcards/:id',
        element: <SuspenseWrap><FlashcardsPage /></SuspenseWrap>,
      },
      {
        path: 'flashcards/topic/:topicId',
        element: <SuspenseWrap><FlashcardsPage /></SuspenseWrap>,
      },
      {
        path: 'podcasts',
        element: <SuspenseWrap><PodcastPage /></SuspenseWrap>,
      },
      {
        path: 'conversations',
        element: <SuspenseWrap><ConversationPage /></SuspenseWrap>,
      },
      {
        path: 'search',
        element: <SuspenseWrap><SearchPage /></SuspenseWrap>,
      },
      {
        path: 'saved',
        element: <SuspenseWrap><SavedWordsPage /></SuspenseWrap>,
      },
      {
        path: 'grammar',
        element: <SuspenseWrap><GrammarPage /></SuspenseWrap>,
      },
    ],
  },
]);
