import React from 'react';
import styles from './featurePill.module.css';

/** Small reassurance card shown beneath the upload list (icon + title + text). */
export default function FeaturePill({ icon, title, description }) {
  return (
    <div className={styles.pill}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <strong className={styles.title}>{title}</strong>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
