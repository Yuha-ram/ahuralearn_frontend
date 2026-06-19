import React from 'react';
import styles from './progressPanel.module.css';

/**
 * 右侧答题进度板组件 (适应性测试专用版)
 * @param {number} totalQuestions 预计的总题数
 * @param {Object} answers 用户的选择题回答对象
 * @param {Object} shortAnswers 用户的简答题回答对象
 * @param {Array} history 已经抽取出来的题目数组 (历史+当前题)
 * @param {number} currentIndex 当前正在看哪一题 (0 开始)
 * @param {function} onSelectQuestion 用户点击题号，跳转到该题的回调
 * @param {function} onSubmitQuiz 点击下方 Submit Quiz 按钮
 */
export default function ProgressPanel({ 
  totalQuestions, 
  answers, 
  shortAnswers, 
  history, 
  currentIndex, 
  onSelectQuestion, 
  onSubmitQuiz 
}) {
  // 计算已经回答的题目数量（合并选择题和简答题的答案判断）
  let answeredCount = 0;
  history.forEach(q => {
    if (answers[q.id] || shortAnswers[q.id]) {
      answeredCount++;
    }
  });

  // 计算结果为保留整数的百分比
  const progressPercent = totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);

  // 生成一个固定长度的数组来渲染矩阵，代表 1...N 题
  const matrix = Array.from({ length: totalQuestions });

  return (
    <div className={styles.panelContainer}>
      {/* 头部：展示 Progress 文本和百分比数字 */}
      <div className={styles.header}>
        <span className={styles.title}>Progress</span>
        <span className={styles.percentage}>{progressPercent}%</span>
      </div>

      {/* 进度条轨道与填充 */}
      <div className={styles.progressBarTrack}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* 显示 “答过几题 / 总几题” */}
      <div className={styles.questionsCount}>
        {answeredCount} / {totalQuestions} Questions
      </div>

      {/* 题号矩阵：循环渲染 1...N */}
      <div className={styles.matrixContainer}>
        {matrix.map((_, idx) => {
          // 在历史记录中寻找这道题（如果是未来还没抽取的题，historyItem 就是 undefined）
          const historyItem = history[idx];
          
          // 判定各项状态
          const isAnswered = historyItem ? (!!answers[historyItem.id] || !!shortAnswers[historyItem.id]) : false;
          const isActive = idx === currentIndex; // 判断这题是不是当前屏幕正在展示的题目
          const isFuture = !historyItem; // 判断是否是还没抽取的未来题目

          return (
            <div 
              key={idx} 
              className={`
                ${styles.numberBox} 
                ${isActive ? styles.boxActive : ''} 
                ${isAnswered && !isActive ? styles.boxAnswered : ''}
              `}
              // 如果是未来的题目，设置半透明且不允许点击
              style={{ 
                opacity: isFuture ? 0.4 : 1, 
                cursor: isFuture ? 'not-allowed' : 'pointer',
                backgroundColor: isFuture ? '#f8fafb' : '' 
              }}
              onClick={() => {
                // 只有已经抽取过的题目才允许点击跳转
                if (!isFuture && onSelectQuestion) {
                  onSelectQuestion(idx);
                }
              }}
            >
              {idx + 1}
            </div>
          )
        })}
      </div>

      {/* 底部的提交问卷按钮组件 */}
      <div className={styles.submitAction}>
        <button className={styles.submitButton} onClick={onSubmitQuiz}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
}