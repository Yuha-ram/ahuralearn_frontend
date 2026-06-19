import React from 'react';
import styles from './quickQueries.module.css';

/** Grid of one-tap suggested questions. */
export default function QuickQueries({ queries, onPick }) {
  return (
    <div className={styles.grid}>
      {queries.map((q) => (
        <button key={q} type="button" className={styles.item} onClick={() => onPick(q)}>
          {q}
        </button>
      ))}
    </div>
  );
}
