import React, { forwardRef } from 'react';
import styles from './questionDetailCard.module.css';

const QuestionDetailCard = forwardRef(({ question, index, userAnswerId, isCorrect }, ref) => {
  
  // 辅助函数：把选项 ID 转换为显示的文本（移到子组件内部自己管理）
  const getOptionText = (q, optionId) => {
    if (!optionId) return 'No Answer';
    if (q.type === 'true-false' || q.type === 'short-answer') return optionId;
    const opt = q.options?.find(o => o.id === optionId);
    return opt ? opt.text : optionId;
  };

  return (
    <div 
      className={`${styles['detail-card']} ${isCorrect ? styles['correct-border'] : styles['incorrect-border']}`}
      ref={ref}
    >
      <div className={styles['card-top']}>
        <span className={styles['q-number']}>Question {index + 1}</span>
        <span className={`${styles['status-badge']} ${isCorrect ? styles['status-pass'] : styles['status-fail']}`}>
          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </span>
      </div>
      
      <h3 className={styles['q-title']}>{question.question}</h3>

      <div className={styles['answer-comparison']}>
        <div className={`${styles['answer-box']} ${styles['user-answer-box']}`}>
          <h4>Your Answer:</h4>
          <p>{getOptionText(question, userAnswerId)}</p>
        </div>
        
        {/* 简答题如果没有标准答案，不显示正确答案对比 */}
        {question.type !== 'short-answer' && (
          <div className={`${styles['answer-box']} ${styles['correct-answer-box']}`}>
            <h4>Correct Answer:</h4>
            <p>{getOptionText(question, question.correctAnswer)}</p>
          </div>
        )}
      </div>

      {!isCorrect && question.type !== 'short-answer' && (
        <div className={styles['ai-explanation']}>
          <strong>💡 AI Tip:</strong> Review the concepts of <em>{question.topic}</em> to understand why the correct answer is better suited here.
        </div>
      )}
    </div>
  );
});

export default QuestionDetailCard;