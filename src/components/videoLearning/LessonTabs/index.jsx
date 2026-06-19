import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LessonTabs.module.css';

export default function LessonTabs({ title, description, lessonId }) {
  const [activeTab, setActiveTab] = useState('Description');
  const navigate = useNavigate();

  // 根据设计图，有 Description 和 Post-class Quiz
  const tabs = ['Description', 'Post-class Quiz'];

  const handleTabClick = (tabName) => {
    if (tabName === 'Post-class Quiz') {
      // 点击测验直接使用 react-router-dom 跳转
      // 我们跳往 /quiz/:lessonId
      if (lessonId) {
         navigate(`/quiz/${lessonId}`);
      }
    } else {
      setActiveTab(tabName);
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsHeader}>
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'Description' && (
          <div>
            <h2 className={styles.lessonTitle}>{title}</h2>
            <p className={styles.lessonDescription}>
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
