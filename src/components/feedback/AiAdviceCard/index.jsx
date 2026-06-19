import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './aiAdviceCard.module.css';

const AiAdviceCard = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 跳转到智能分析页面，确保这里的路径与你 App.jsx 中配置的路由一致
    navigate('/analysis'); 
  };

  return (
    <div 
     className={styles['ai-recommendation-wrapper']}
     onClick={handleCardClick}
    >
      <div className={styles['section-header']}>
        <div className={`${styles.icon} ${styles['info-icon']}`}>🤖</div>
        <div>
          <h2>AI Study Assistant</h2>
          <p>Targeted advice to help you improve faster with practice and concept clarity.</p>
        </div>
      </div>
      
      <div className={styles['recommendation-content']}>
        <strong>Need deeper insights?</strong>
        <p>Your AI assistant has prepared a personalized analysis of your weak points. Click here to start an interactive chat and explore your results in detail!</p>
      </div>

      <div className={styles['enter-chat-link']}>
        Enter AI Analysis Chat <span>→</span>
      </div>
    </div>
  );
};

export default AiAdviceCard;