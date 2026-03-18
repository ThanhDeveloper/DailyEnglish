import '@testing-library/jest-dom';

// Mock Web Speech API (not available in jsdom)
Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
    onvoiceschanged: null,
    speaking: false,
    pending: false,
    paused: false,
  },
  writable: true,
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: vi.fn().mockImplementation(() => ({
    text: '',
    lang: '',
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null,
    onend: null,
    onerror: null,
  })),
  writable: true,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
