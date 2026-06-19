import styles from './assessmentSummary.module.css';
import { useState, useEffect } from 'react';

// 这里加入 Mock 数据作为默认值兜底
const AssessmentSummary = ({ 
  score = 84, 
  maxScore = 100, 
  date = "Oct 24, 2023", 
  duration = "18 mins", 
  focusArea = "Java Advanced" 
}) => {
  // 专门用于控制视觉动画显示的动态分数状态
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // 只有当目标分数大于 0 时才执行动画
    if (score === 0) return;

    let current = 0;
    const animationDuration = 1000; // 动画总时长 1000ms (1秒)
    const frameRate = 16; // 大约 60fps
    const step = score / (animationDuration / frameRate); // 每次增加的步长

    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setDisplayScore(score); // 确保最后一步正好是目标分数
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, frameRate);

    // 清除副作用，防止内存泄漏
    return () => clearInterval(timer);
  }, [score]); // 当传入的 score 变化时重新触发动画

  // 计算当前动画帧的百分比，用于进度条宽度
  const percentage = maxScore > 0 ? (displayScore / maxScore) * 100 : 0;

  return (
    <div className={styles.card}>
      <h4 className={styles['summary-title']}>Assessment Summary</h4>

      <div className={styles['score-display']}>
        <div className={styles['score-number']}>
          {/* 这里使用带动画效果的 displayScore */}
          <span className={styles.score}>{displayScore}</span>
          <span className={styles['score-max']}>/{maxScore}</span>
        </div>

        <div style={{ flex: 1 }}>
          {/* <div className={styles['improvement']}>{improvement}% Improvement</div> */}

          {/* 👇 在这里加入进度条的 HTML 结构 👇 */}
          <div className={styles['summary-progress-bg']}>
            <div 
              className={styles['progress-bar-fill']}
              style={{ 
                width: `${percentage}%`, // 动态绑定宽度百分比
                background: '#4caf50',   // 给进度条一个颜色
              }} 
            />
          </div>
          {/* 👆 进度条结构结束 👆 */}

        </div>
      </div>

<div className={styles['summary-details']}>
        <div className={styles['detail-item']}>
          <span className={styles['detail-label']}>Date</span>
          <span className={styles['detail-value']}>{date}</span>
        </div>

        <div className={styles['detail-item']}>
          <span className={styles['detail-label']}>Duration</span>
          <span className={styles['detail-value']}>{duration}</span>
        </div>

        <div className={styles['detail-item']}>
          <span className={styles['detail-label']}>Focus Area</span>
          <span className={`${styles['detail-value']} ${styles['focus-area']}`}>
            {focusArea}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSummary;