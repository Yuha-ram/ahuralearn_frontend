import React from 'react';
import styles from './progressPanel.module.css';

/**
 * 右侧答题进度板组件
 * @param {Array} questions 题目总数组
 * @param {Array} answers 用户的回答数组数据
 * @param {number} currentIndex 当前正在看哪一题 (0 开始)
 * @param {function} onSelectQuestion 用户点击题号，跳转到该题的回调
 * @param {function} onSubmitQuiz 点击下方 Submit Quiz 按钮
 */
export default function ProgressPanel({ questions, answers, currentIndex, onSelectQuestion, onSubmitQuiz }) {
  // 计算进度百分比：已经回答的题目数量除以总题数
  const total = questions.length;
  // 通过 answers 里寻找 selectedOption 有值的，说明答了
  const answeredCount = answers.filter(a => a.selectedOption).length;
  // 计算结果为保留整数的百分比
  const progressPercent = total === 0 ? 0 : Math.round((answeredCount / total) * 100);

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
        {answeredCount} / {total} Questions
      </div>

      {/* 题号矩阵：循环渲染 1...N */}
      <div className={styles.matrixContainer}>
        {questions.map((q, idx) => {
          // 在用户的回答数据里找这个题
          const answerData = answers.find(a => a.questionId === q.id);
          // 判定各项状态
          const isAnswered = !!answerData?.selectedOption;
          const isFlagged = !!answerData?.isFlagged;
          const isActive = idx === currentIndex; // 判断这题是不是当前屏幕正在展示的题目

          return (
            // 点击方块时，利用回调直接跳转到该题
            <div 
              key={q.id} 
              className={`
                ${styles.numberBox} 
                ${isActive ? styles.boxActive : ''} 
                ${isAnswered && !isActive ? styles.boxAnswered : ''}
              `}
              onClick={() => onSelectQuestion(idx)}
            >
              {idx + 1}
              
              {/* 如果被标记了 (isFlagged === true)，右上角放红旗 */}
              {isFlagged && (
                <span className={styles.flagIcon} title="Flagged">
                  🚩
                </span>
              )}
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
