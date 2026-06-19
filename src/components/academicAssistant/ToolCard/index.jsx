import React from 'react';
import styles from './toolCard.module.css';

/** Clickable helper tool (e.g. Citation Generator) that seeds + runs a query. */
export default function ToolCard({ icon, title, description, onClick }) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <strong className={styles.title}>{title}</strong>
        <p className={styles.description}>{description}</p>
      </div>
    </button>
  );
}
