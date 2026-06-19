import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import styles from './courseCard.module.css';

/**
 * 课程卡片组件
 * 展示课程的简要信息，点击可跳转到课程详情。
 */
export default function CourseCard({ course }) {
  // 初学者指南：使用 useNavigate 可以在不刷新页面的前提下，通过代码跳转路由
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 跳转到课程详情页 /course/:courseId
    navigate(`/course/${course.id}`);
  };

  // 根据难度级别决定胶囊样式的类名
  const getDifficultyClass = (difficulty) => {
    const level = difficulty?.toUpperCase() || '';
    if (level === 'BEGINNER') return styles.levelBeginner;
    if (level === 'INTERMEDIATE') return styles.levelIntermediate;
    if (level === 'ADVANCED') return styles.levelAdvanced;
    return styles.levelDefault;
  };

  return (
    <div className={styles.cardContainer} onClick={handleCardClick}>
      {/* 封面图片区 */}
      <div className={styles.imageWrapper}>
        <img 
          src={course.coverUrl || course.coverImage} 
          alt={course.name || course.title} 
          className={styles.coverImage}
          loading="lazy"
        />
      </div>

      {/* 文本信息区 */}
      <div className={styles.infoWrapper}>
        {/* 难度级别标签 */}
        <div className={styles.metaRow}>
          <span className={`${styles.difficultyBadge} ${getDifficultyClass(course.difficultyLevel)}`}>
            {course.difficultyLevel}
          </span>
        </div>

        {/* 课程名称 (自动省略为最多两行) */}
        <h3 className={styles.courseTitle}>{course.name || course.title}</h3>

        {/* 讲师名字 */}
        <p className={styles.instructorName}>{course.instructorName || course.instructor}</p>

        {/* 评分行 */}
        <div className={styles.ratingRow}>
          <span className={styles.ratingNumber}>{course.rating?.toFixed(1) || '0.0'}</span>
          <div className={styles.starsWrapper}>
            {/* 底层：灰色的空星星 */}
            <div className={styles.starsEmpty}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={`empty-${star}`} size={14} fill="currentColor" />
              ))}
            </div>
            {/* 顶层：黄色的实心星星，通过 width 控制显示百分比 */}
            <div 
              className={styles.starsFilled} 
              style={{ width: `${((course.rating || 0) / 5) * 100}%` }}
            >
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={`filled-${star}`} size={14} fill="currentColor" />
              ))}
            </div>
          </div>
          <span className={styles.reviewCount}>({(course.reviewCount || course.reviewsCount || 0).toLocaleString()})</span>
        </div>
      </div>
    </div>
  );
}
