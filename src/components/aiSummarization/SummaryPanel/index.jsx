import React from 'react';
import { Sparkles, RefreshCw, Copy, CheckCircle2 } from 'lucide-react';
import styles from './summaryPanel.module.css';

/** Executive-summary card: intro paragraph, key points, regenerate + copy. */
export default function SummaryPanel({ summary, keyPoints, loading, message, copied, onRegenerate, onCopy }) {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.titleRow}>
          <Sparkles size={18} color="#2563eb" />
          <h2 className={styles.title}>AI Executive Summary</h2>
        </div>
      </div>

      {loading ? (
        <p className={styles.placeholder}>Generating summary…</p>
      ) : (
        <>
          <p className={styles.intro}>
            {summary || message || 'The summary for this document will appear here once processing finishes.'}
          </p>

          {keyPoints.length > 0 && (
            <ul className={styles.points}>
              {keyPoints.map((point, i) => (
                <li key={i}>
                  <CheckCircle2 size={16} color="#2563eb" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.secondaryBtn} onClick={onRegenerate}>
              <RefreshCw size={14} />
              Regenerate
            </button>
            <button type="button" className={styles.primaryBtn} onClick={onCopy}>
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
