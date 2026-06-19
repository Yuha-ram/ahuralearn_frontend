import React, { useEffect, useRef } from 'react';
import { Sparkles, Send, FileText } from 'lucide-react';
import styles from './chatPanel.module.css';

/**
 * Q&A chat panel for the AI Summarization page.
 *
 * Fix #11: new messages scroll only THIS panel's message list (we set the
 * list's own scrollTop), never the whole page — unlike scrollIntoView, which
 * drags the entire window to the bottom.
 *
 * Fix #12: no "attach files" control here. Attaching files inside the chat is
 * not implemented, so it is intentionally left out rather than shown broken.
 */
export default function ChatPanel({
  documentName,
  documents = [],
  activeDocId,
  onSelectDoc,
  messages,
  typing,
  input,
  onInputChange,
  onSend,
}) {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight; // scroll the container, not the page
  }, [messages, typing]);

  const submit = () => {
    if (!input.trim()) return;
    onSend(input);
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.tutor}>
          <div className={styles.tutorAvatar}><Sparkles size={18} color="#2563eb" /></div>
          <div>
            <div className={styles.tutorName}>AhuraLearn AI Tutor</div>
            <div className={styles.tutorStatus}><span className={styles.onlineDot} />Online &amp; Ready</div>
          </div>
        </div>
        {/* File picker lives here in the chat header. With more than one uploaded
            file it is a dropdown (fix #10); with one it shows the file name. */}
        {documents.length > 1 ? (
          <div className={styles.docTab}>
            <FileText size={14} />
            <select
              className={styles.docSelect}
              value={activeDocId ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                const match = documents.find((d) => String(d.id) === v);
                onSelectDoc(match ? match.id : v);
              }}
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        ) : documentName ? (
          <div className={styles.docTab}>
            <FileText size={14} />
            <span className={styles.docTabName}>{documentName}</span>
          </div>
        ) : null}
      </div>

      <div className={styles.messageList} ref={listRef}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.bubble} ${m.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className={`${styles.bubble} ${styles.aiBubble} ${styles.typing}`}>
            <span /><span /><span />
          </div>
        )}
      </div>

      <div className={styles.composer}>
        <input
          type="text"
          className={styles.input}
          placeholder="Ask anything about this document..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button type="button" className={styles.sendButton} onClick={submit} disabled={!input.trim()} aria-label="Send">
          <Send size={18} />
        </button>
      </div>
    </aside>
  );
}
