export function speak(text: string, rate = 0.9): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => v.lang.startsWith('en') && v.name.includes('Google')
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) utterance.voice = englishVoice;
  window.speechSynthesis.speak(utterance);
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
