import { useState, useCallback } from 'react';
import { checkGrammar, type GrammarResult } from '../../utils/grammar';
import styles from './GrammarPage.module.css';

export function GrammarPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCheck = useCallback(() => {
    if (!text.trim()) return;
    const grammarResult = checkGrammar(text);
    setResult(grammarResult);
  }, [text]);

  const handleClear = useCallback(() => {
    setText('');
    setResult(null);
    setCopied(false);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.corrected);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = result.corrected;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleCheck();
      }
    },
    [handleCheck]
  );

  // Build highlighted text with error spans
  function renderHighlightedText() {
    if (!result || result.corrections.length === 0) return null;
    const parts: React.ReactNode[] = [];
    let cursor = 0;
    result.corrections.forEach((c, i) => {
      if (c.position.start > cursor) {
        parts.push(
          <span key={`text-${i}`}>{result.original.slice(cursor, c.position.start)}</span>
        );
      }
      parts.push(
        <span key={`err-${i}`} className={styles.errorHighlight} title={c.explanation}>
          {c.original || '\u200B'}
        </span>
      );
      cursor = c.position.end;
    });
    if (cursor < result.original.length) {
      parts.push(<span key="text-end">{result.original.slice(cursor)}</span>);
    }
    return parts;
  }

  function getCorrectionBadge() {
    if (!result) return null;
    const count = result.corrections.length;
    if (count === 0) {
      return <span className={`${styles.badge} ${styles.badgeSuccess}`}>No issues found</span>;
    }
    if (count <= 3) {
      return (
        <span className={`${styles.badge} ${styles.badgeWarning}`}>
          {count} {count === 1 ? 'issue' : 'issues'} found
        </span>
      );
    }
    return (
      <span className={`${styles.badge} ${styles.badgeError}`}>
        {count} issues found
      </span>
    );
  }

  return (
    <div className="page-enter">
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Grammar Correction Tool</h1>
          <p className={styles.subtitle}>
            Paste or type your text below to check for common grammar errors
          </p>
        </div>

        <div className={styles.inputSection}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setResult(null);
              setCopied(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type or paste your English text here... (Ctrl+Enter to check)"
            aria-label="Text to check for grammar errors"
          />
          <div className={styles.charCount}>{text.length} characters</div>
          <div className={styles.actions}>
            <button
              className={styles.checkBtn}
              onClick={handleCheck}
              disabled={!text.trim()}
            >
              <CheckGrammarIcon size={18} />
              Check Grammar
            </button>
            {text && (
              <button className={styles.clearBtn} onClick={handleClear}>
                Clear
              </button>
            )}
          </div>
        </div>

        {result && result.corrections.length === 0 && (
          <div className={styles.noErrors}>
            <div className={styles.noErrorsIcon}>
              <CheckCircleIcon size={48} />
            </div>
            <p className={styles.noErrorsTitle}>No grammar issues found!</p>
            <p className={styles.noErrorsDesc}>Your text looks good. Keep up the great writing.</p>
          </div>
        )}

        {result && result.corrections.length > 0 && (
          <div className={styles.resultsSection}>
            {/* Original with highlights */}
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h2 className={styles.resultTitle}>Original Text</h2>
                {getCorrectionBadge()}
              </div>
              <div className={styles.textDisplay}>{renderHighlightedText()}</div>
            </div>

            {/* Corrected text */}
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h2 className={styles.resultTitle}>Corrected Text</h2>
                <button className={styles.copyBtn} onClick={handleCopy}>
                  {copied ? 'Copied!' : 'Copy Corrected Text'}
                </button>
              </div>
              <div className={styles.correctedDisplay}>{result.corrected}</div>
            </div>

            {/* Corrections list */}
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h2 className={styles.resultTitle}>Corrections</h2>
              </div>
              <ul className={styles.correctionsList}>
                {result.corrections.map((c, i) => (
                  <li key={i} className={styles.correctionItem}>
                    <div className={styles.correctionChange}>
                      <span className={styles.correctionOriginal}>
                        {c.original || '(missing)'}
                      </span>
                      <span className={styles.correctionArrow}>&rarr;</span>
                      <span className={styles.correctionFixed}>{c.corrected}</span>
                    </div>
                    <div className={styles.correctionRule}>{c.rule}</div>
                    <div className={styles.correctionExplanation}>{c.explanation}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple inline icons for this page
function CheckGrammarIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function CheckCircleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-success)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
