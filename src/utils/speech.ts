export type Accent = 'us' | 'uk';

const ACCENT_STORAGE_KEY = 'dailyenglish_accent';

const PREFERRED_VOICES_US = [
  'Google US English',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Samantha',
  'Google English',
];

const PREFERRED_VOICES_UK = [
  'Google UK English Female',
  'Google UK English Male',
  'Microsoft Ryan Online (Natural) - English (United Kingdom)',
  'Daniel',
  'Google English',
];

export function getAccent(): Accent {
  const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
  if (stored === 'uk') return 'uk';
  return 'us';
}

export function setAccent(accent: Accent): void {
  localStorage.setItem(ACCENT_STORAGE_KEY, accent);
}

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const accent = getAccent();
  const preferredList = accent === 'uk' ? PREFERRED_VOICES_UK : PREFERRED_VOICES_US;
  const primaryLang = accent === 'uk' ? 'en-GB' : 'en-US';
  const fallbackLang = accent === 'uk' ? 'en-US' : 'en-GB';

  for (const preferred of preferredList) {
    const match = voices.find((v) => v.name === preferred);
    if (match) return match;
  }
  // Fallback: any voice matching the preferred locale, then the other, then any English
  return (
    voices.find((v) => v.lang === primaryLang) ||
    voices.find((v) => v.lang === fallbackLang) ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}

export function speak(text: string, rate = 0.88): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getAccent() === 'uk' ? 'en-GB' : 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1;

  // Voices may not be loaded yet on first call
  const trySpeak = () => {
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      trySpeak();
    };
  } else {
    trySpeak();
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export function startListening(): Promise<SpeechRecognitionResult> {
  return new Promise((resolve, reject) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getAccent() === 'uk' ? 'en-GB' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0];
      resolve({
        transcript: result.transcript,
        confidence: result.confidence,
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      reject(new Error(event.error));
    };

    recognition.start();
  });
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function isRecognitionSupported(): boolean {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
