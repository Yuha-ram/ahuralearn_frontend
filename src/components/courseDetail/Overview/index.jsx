import React from 'react';
import { Check } from 'lucide-react';
import styles from './Overview.module.css';

export default function Overview({ courseData }) {
  // 从后端原始数据里解构出 description (当做 aboutCourse) 和 outcomes
  const { description: aboutCourse, outcomes } = courseData;

  return (
    <div className={styles.overviewContainer}>
      <h2 className={styles.sectionTitle}>About this Course</h2>
      {/* 文本可能包含换行符，用 className={styles.aboutText} 进行处理 */}
      <div className={styles.aboutText}>
        {aboutCourse}
      </div>

      <div className={styles.outcomesCard}>
        <h3 className={styles.outcomesTitle}>What you'll learn</h3>
        <div className={styles.outcomesGrid}>
          {outcomes && outcomes.map((item, index) => (
            <div key={index} className={styles.outcomeItem}>
              <Check className={styles.checkIcon} size={20} />
              <span className={styles.outcomeText}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
