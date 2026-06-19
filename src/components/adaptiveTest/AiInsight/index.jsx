import React from 'react';
import styles from './aiInsight.module.css';

// 💡 新增：接收 currentIndex 以便判断当前是第几题
const AIInsight = ({ difficultyLevel, topic, currentIndex, aiStatus }) => {
  
 // 💡 核心逻辑：根据题号和难度，动态生成不同的 AI 话术
  const getDynamicMessage = () => {
    if (currentIndex === 0) {
      return (
        <>
          Welcome! Let's start by assessing your baseline knowledge. I've set the initial difficulty to <strong>Level {difficultyLevel}</strong> for <strong>{topic}</strong>.
        </>
      );
    } else if (difficultyLevel >= 4) {
      return (
        <>
          You're doing great! I've increased the challenge to <strong>Level {difficultyLevel}</strong> to test your mastery of <strong>{topic}</strong>.
        </>
      );
    } else {
      return (
        <>
          Based on your recent performance, I've adjusted the difficulty to <strong>Level {difficultyLevel}</strong> to optimally challenge your understanding of <strong>{topic}</strong>.
        </>
      );
    }
  }; 
  

  return (
    // ⚠️ 注意这里：去掉了 <aside className="panel-secondary">，只保留里面的卡片
  
      <div className={styles['ai-card']}>
        <div className={styles['ai-header']}>
          <div className={styles['ai-avatar']}>
            <span className={styles.icon}>🤖</span>
          </div>
          <div>
            <h4>AI Insight</h4>
            <small>Adaptive guidance</small>
          </div>
        </div>

{/* 💡 渲染动态生成的文本 */}
        <p>
          {getDynamicMessage()}
        </p>

        <div className={styles['ai-footer']}>
{/* 💡 核心修改：优先使用后端传来的 aiStatus。如果后端没传（或者数据还没好），才用前端兜底逻辑 */}
          <span>Status: {aiStatus || (difficultyLevel >= 4 ? 'High Confidence' : 'Adjusting...')}</span>

        </div>
      </div>

  );
};

export default AIInsight;