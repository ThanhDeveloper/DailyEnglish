const PREFERRED_VOICES = [
  // High-quality neural/natural voices (Chrome/Edge)
  'Google US English',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Google UK English Female',
  'Google UK English Male',
  // macOS/iOS
  'Samantha',
  'Daniel',
  // Fallback Google
  'Google English',
];

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  for (const preferred of PREFERRED_VOICES) {
    const match = voices.find((v) => v.name === preferred);
    if (match) return match;
  }
  // Fallback: any en-US or en-GB voice
  return (
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  );
}

export function speak(text: string, rate = 0.88): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
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
    recognition.lang = 'en-US';
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
