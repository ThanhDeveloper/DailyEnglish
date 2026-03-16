import { useState, useCallback } from 'react';
import {
  speak,
  startListening,
  isSpeechSupported,
  isRecognitionSupported,
} from '../utils/speech';
import type { SpeechRecognitionResult } from '../utils/speech';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const speakText = useCallback((text: string, rate?: number) => {
    speak(text, rate);
  }, []);

  const listen = useCallback(async () => {
    setIsListening(true);
    setError(null);
    setResult(null);
    try {
      const res = await startListening();
      setResult(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Recognition failed';
      setError(msg);
      return null;
    } finally {
      setIsListening(false);
    }
  }, []);

  return {
    speakText,
    listen,
    isListening,
    result,
    error,
    canSpeak: isSpeechSupported(),
    canListen: isRecognitionSupported(),
  };
}
