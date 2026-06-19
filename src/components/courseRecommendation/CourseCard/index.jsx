import React from 'react';
import { Sparkles, Clock, Star } from 'lucide-react';
import styles from './courseCard.module.css';

/**
 * AI 推荐的单张课程卡片组件
 * @param {object} course 包含课程信息的对象
 */
export default function CourseCard({ course }) {
  // 模拟课程的一些其它信息，因为接口可能不返回所有细节
  const duration = "12h 30m";
  const rating = 4.8;
  
  // 生成一个纯文字颜色的首字母作为左侧图片的占位图内容（如果需要实际图片则可以用 img）
  
  return (
    <div className={styles.cardContainer}>
      {/* 左侧图片/封面区 */}
      <div className={styles.imageWrapper}>
        {/* 这里使用一个简单的颜色块或者图片代替 */}
        <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', padding: '1rem' }}>
          {course.title.split(' ')[0]}
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.cardContent}>
        <div className={styles.headerRow}>
          <h4 className={styles.title}>{course.title}</h4>
          {/* 这里可以根据 level 的不同改变颜色，比如 Intermediate 可以是淡蓝色，现在暂时全用默认样式 */}
          <span className={styles.levelBadge} style={{
            backgroundColor: course.level.includes('Intermediate') ? '#e0e7ff' : '#d1fae5',
            color: course.level.includes('Intermediate') ? '#4338ca' : '#059669',
          }}>
            {course.level}
          </span>
        </div>

        {/* 推荐理由的特殊框 */}
        <div className={styles.reasonBox}>
          <Sparkles className={styles.reasonIcon} size={18} />
          <p className={styles.reasonText}>
            <strong>Why recommended:</strong> {course.reason}
          </p>
        </div>

        {/* 底部信息和按钮 */}
        <div className={styles.footerRow}>
          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <Clock size={16} />
              <span>{duration}</span>
            </div>
            <div className={styles.metaItem}>
              <Star size={16} fill="currentColor" color="#fbbf24" />
              <span>{rating}</span>
            </div>
          </div>
          {/* 由于要跳转 因此后端返回的数据还应包括课程id */}
          <button className={styles.viewButton}>View Course</button>
        </div>
      </div>
    </div>
  );
}
