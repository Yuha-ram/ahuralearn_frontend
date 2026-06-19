import React from 'react';
import { FileText, X } from 'lucide-react';
import styles from './uploadList.module.css';

// Per the team convention, formatSize lives directly where it is used (here,
// the only place file sizes are rendered) rather than in a shared module.
function formatSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_LABEL = {
  uploading: 'Uploading…',
  done: 'Complete',
  failed: 'Failed',
};

/**
 * Scrollable list of uploaded files. The list itself scrolls internally once it
 * grows past a few rows, so the overall page height stays fixed no matter how
 * many files are added.
 */
export default function UploadList({ uploads, onRemove }) {
  if (!uploads.length) return null;

  return (
    <div className={styles.section}>
      <h4 className={styles.label}>ACTIVE UPLOADS</h4>

      <div className={styles.scrollArea}>
        {uploads.map((item) => (
          <div key={item.id} className={styles.row}>
            <div className={styles.fileIcon}>
              <FileText size={20} color="#ef4444" />
            </div>

            <div className={styles.info}>
              <div className={styles.meta}>
                <span className={styles.name}>{item.name}</span>
                <div className={styles.right}>
                  <span className={`${styles.status} ${styles[item.status] || ''}`}>
                    {STATUS_LABEL[item.status] || ''}
                  </span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => onRemove(item.id)}
                    aria-label="Remove file"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <span className={styles.size}>{formatSize(item.size)}</span>

              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressFill} ${item.status === 'failed' ? styles.progressFailed : ''}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
