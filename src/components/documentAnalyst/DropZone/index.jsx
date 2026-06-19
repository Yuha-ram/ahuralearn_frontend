import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import styles from './dropZone.module.css';

/**
 * Drag-and-drop / browse area for picking course materials.
 * Presentational only: it reports chosen files up through onFiles; the parent
 * page owns the upload list, de-duplication, and the API calls.
 */
export default function DropZone({ dragging, onDragOver, onDragLeave, onDrop, onFiles }) {
  const fileInputRef = useRef(null);

  return (
    <div
      className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.pptx"
        multiple
        hidden
        onChange={(e) => {
          // Hand the chosen files up, then clear the input's value. Without this
          // reset, re-picking the SAME file the input already holds fires no
          // onChange, so the parent's duplicate check (and its toast) never runs.
          onFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <div className={styles.iconCircle}>
        <UploadCloud size={30} color="#f97316" />
      </div>

      <h3 className={styles.heading}>Upload Course Materials</h3>
      <p className={styles.hint}>
        Drag and drop your files here <strong>(PDF, DOCX, PPTX)</strong> or<br />
        click to browse from your computer.
      </p>

      <button
        type="button"
        className={styles.browseButton}
        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
      >
        Browse Files
      </button>
    </div>
  );
}
