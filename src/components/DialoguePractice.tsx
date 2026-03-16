import { useState } from 'react';
import type { Dialogue } from '../types';
import { VolumeIcon, PlayIcon } from './Icons';
import { speak } from '../utils/speech';
import styles from './DialoguePractice.module.css';

interface DialoguePracticeProps {
  dialogue: Dialogue;
}

export function DialoguePractice({ dialogue }: DialoguePracticeProps) {
  const [highlightIdx, setHighlightIdx] = useState(-1);

  async function playAll() {
    for (let i = 0; i < dialogue.lines.length; i++) {
      setHighlightIdx(i);
      speak(dialogue.lines[i].text, 0.85);
      await new Promise((r) => setTimeout(r, dialogue.lines[i].text.length * 60 + 1200));
    }
    setHighlightIdx(-1);
  }

  return (
    <div className={styles.dialogue}>
      <div className={styles.header}>
        <h3 className={styles.title}>{dialogue.title}</h3>
        <button className="btn btn-outline" onClick={playAll}>
          <PlayIcon size={16} /> Play All
        </button>
      </div>
      <div className={styles.speakers}>
        {dialogue.speakers.map((s, i) => (
          <span key={i} className={styles.speaker} style={{ color: i === 0 ? '#2563eb' : '#8b5cf6' }}>
            {s}
          </span>
        ))}
      </div>
      <div className={styles.lines}>
        {dialogue.lines.map((line, i) => {
          const speakerIdx = dialogue.speakers.indexOf(line.speaker);
          return (
            <div
              key={i}
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
