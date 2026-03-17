import { useState, useRef, useEffect, useCallback } from 'react';
import type { Dialogue } from '../types';
import { VolumeIcon, PlayIcon } from './Icons';
import { speak } from '../utils/speech';
import styles from './DialoguePractice.module.css';

interface DialoguePracticeProps {
  dialogue: Dialogue;
  onComplete?: () => void;
}

export function DialoguePractice({ dialogue, onComplete }: DialoguePracticeProps) {
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const linesContainerRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef(false);

  // Auto-scroll to highlighted line
  useEffect(() => {
    if (highlightIdx >= 0 && lineRefs.current[highlightIdx]) {
      lineRefs.current[highlightIdx]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightIdx]);

  const stopPlayback = useCallback(() => {
    stopRef.current = true;
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
    setHighlightIdx(-1);
  }, []);

  async function playAll() {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    stopRef.current = false;
    setIsPlaying(true);
    for (let i = 0; i < dialogue.lines.length; i++) {
      if (stopRef.current) break;
      setHighlightIdx(i);
      speak(dialogue.lines[i].text, 0.85);
      await new Promise((r) => setTimeout(r, dialogue.lines[i].text.length * 58 + 1200));
    }
    if (!stopRef.current) {
      setHighlightIdx(-1);
      setIsPlaying(false);
      onComplete?.();
    }
  }

  return (
    <div className={styles.dialogue}>
      <div className={styles.header}>
        <h3 className={styles.title}>{dialogue.title}</h3>
        <button
          className={`btn btn-outline ${isPlaying ? styles.stopBtn : ''}`}
          onClick={playAll}
        >
          <PlayIcon size={16} /> {isPlaying ? 'Stop' : 'Play All'}
        </button>
      </div>
      <div className={styles.speakers}>
        {dialogue.speakers.map((s, i) => (
          <span key={i} className={styles.speaker} style={{ color: i === 0 ? '#2563eb' : '#8b5cf6' }}>
            {s}
          </span>
        ))}
      </div>
      <div className={styles.lines} ref={linesContainerRef}>
        {dialogue.lines.map((line, i) => {
          const speakerIdx = dialogue.speakers.indexOf(line.speaker);
          return (
            <div
              key={i}
              ref={(el) => { lineRefs.current[i] = el; }}
              className={`${styles.line} ${speakerIdx === 1 ? styles.right : ''} ${highlightIdx === i ? styles.active : ''}`}
            >
              <div className={styles.bubble} style={{ borderColor: speakerIdx === 0 ? '#2563eb' : '#8b5cf6' }}>
                <span className={styles.name}>{line.speaker}</span>
                <p>{line.text}</p>
                <button
                  className={styles.speakBtn}
                  onClick={() => speak(line.text, 0.85)}
                  aria-label="Play line"
                >
                  <VolumeIcon size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
