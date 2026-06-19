import React from 'react';
import styles from './questionDisplay.module.css';

const QuestionDisplay = ({ data, selectedAnswer, onAnswerChange, openAnswer, onOpenAnswerChange }) => {
  if (data.type === 'multiple-choice') {
    return (
      <div className={styles['question-box']}>
        <p className={styles['question-number']}>QUESTION {data.id}</p>
        <h1 className={styles['question-title']}>{data.question}</h1>
        <div className={styles.options}>
          {data.options.map((opt) => (
            <label 
              key={opt.id} 
              className={`${styles.option} ${selectedAnswer === opt.id ? styles.checked : ''}`}
             onClick={(e) => {
                e.preventDefault(); // 阻止 label 的默认行为，防止触发两次点击
                // 核心逻辑：如果点的是已经选中的，就传 null 取消选中；否则传新的 id
                onAnswerChange(selectedAnswer === opt.id ? null : opt.id);
              }}
            >
              <input type="radio" name="answer" checked={selectedAnswer === opt.id} readOnly />
              <span className={styles['option-label']}>
                <span className={styles['option-icon']}>✓</span>
                {opt.text}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (data.type === 'true-false' || data.type === 'short-answer') {
    return (
      <div className={styles['question-box']}>
        {data.type === 'true-false' && (
          <>
            <p className={styles['question-number']}>TRUE / FALSE</p>
            <h1 className={styles['question-title']}>{data.question}</h1>
            <div className={styles.options}>
              {['true', 'false'].map((val) => (
                <label 
                  key={val}
                  className={`${styles.option} ${selectedAnswer === val ? styles.checked : ''}`}
                  onClick={(e) => {
                    e.preventDefault();// 同样阻止默认行为
                    // 核心逻辑：再次点击取消
                    onAnswerChange(selectedAnswer === val ? null : val);
                  }}
                >
                  <input type="radio" name="tf" checked={selectedAnswer === val} readOnly />
                  <span className={styles['option-label']}>
                    <span className={styles['option-icon']}>✓</span>
                    {val.charAt(0).toUpperCase() + val.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}

        {data.type === 'short-answer' && (
          <>
            <p className={styles['question-number']}>SHORT ANSWER</p>
            <h1 className={styles['question-title']}>{data.question}</h1>
            <div className={styles['short-answer']}>
              <textarea
                className={styles['textarea-field']}
                placeholder="Type your answer here..."
                value={openAnswer}
                onChange={(e) => onOpenAnswerChange(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    );
  }
  return null;
};

export default QuestionDisplay;