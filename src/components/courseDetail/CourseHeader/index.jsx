import React from 'react';
import { Star, BarChart, Calendar, Clock } from 'lucide-react';
import styles from './CourseHeader.module.css';

export default function CourseHeader({ courseData, isEnrolled, onEnrollClick, onContinueLearning }) {

  // 安全提取需要的属性，防止报错，并在组件内完成重命名/兜底
  const {
    categoryName: category = 'Category',
    name: title = 'Course Title',
    subtitle: description = '',
    rating = 0,
    reviewCount: reviews = 0,
    enrolledCount: enrollCount = 0,
    instructor = {},
    hoursRequired = 0,
    difficultyLevel: difficulty = 'Beginner'
  } = courseData;

  const { name = 'Unknown', avatar } = instructor;
  const approxHours = hoursRequired || 0;
  const weeksToComplete = Math.ceil(approxHours / 5) || 1; // 粗略估算每周学习5小时

  // 格式化难度显示，如把 INTERMEDIATE 变成 Intermediate
  const formattedDifficulty = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase() : 'Unknown';

  let difficultyDescription = 'Experience recommended accordingly';
  if (difficulty?.toUpperCase() === 'BEGINNER') {
    difficultyDescription = 'No experience required';
  } else if (difficulty?.toUpperCase() === 'INTERMEDIATE') {
    difficultyDescription = 'Basic knowledge recommended';
  } else if (difficulty?.toUpperCase() === 'ADVANCED') {
    difficultyDescription = 'Prior experience required';
  }

  return (
    <div className={styles.courseHeaderContainer}>
      <div className={styles.courseHeaderInner}>

        {/* 初学者指南：用来展示上方蓝底样式的分类标签 */}
        <div className={styles.categoryBadge}>{category}</div>

        <h1 className={styles.courseTitle}>{title}</h1>
        <p className={styles.courseDescription}>{description}</p>

        <div className={styles.headerMetaRow}>

          <div className={styles.metaInstructorInfo}>
            {avatar && <img src={avatar} alt={name} className={styles.metaAvatar} />}
            <div className={styles.metaInstructorText}>
              <span className={styles.metaRole}>Instructor</span>
              <span className={styles.metaName}>{name}</span>
            </div>
          </div>

          <div className={styles.metaRatingInfo}>
            <div className={styles.starsRow}>
              <div className={styles.starsWrapper}>
                <div className={styles.starsEmpty}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={`empty-${star}`} size={16} fill="currentColor" />
                  ))}
                </div>
                <div
                  className={styles.starsFilled}
                  style={{ width: `${(rating / 5) * 100}%` }}
                >
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={`filled-${star}`} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
              <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
            </div>
            <span className={styles.reviewsText}>{reviews.toLocaleString()} reviews</span>
          </div>

          <div className={styles.metaEnrollCount}>
            <span className={styles.enrollNumber}>{enrollCount.toLocaleString()}</span> students already enrolled
          </div>

        </div>

        <div className={styles.headerActionRow}>
          {/* 初学者指南：条件渲染按钮文本与状态
              如果 isEnrolled (已报名) 是 true，我们提示继续学习；
              否则显示 Enroll Now 报名按钮并绑定点击事件。 */}
          <button
            className={`${styles.enrollBtn} ${isEnrolled ? styles.enrolled : ''}`}
            onClick={!isEnrolled ? onEnrollClick : onContinueLearning}
          >
            {isEnrolled ? 'Continue Learning' : 'Enroll Now'}
          </button>

          <div className={styles.featureCardsRow}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}><BarChart size={20} /></div>
              <div className={styles.featureTextInfo}>
                <span className={styles.featureTitle}>{formattedDifficulty} Level</span>
                <span className={styles.featureSub}>{difficultyDescription}</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}><Calendar size={20} /></div>
              <div className={styles.featureTextInfo}>
                <span className={styles.featureTitle}>Flexible Deadlines</span>
                <span className={styles.featureSub}>Learn at your own pace</span>
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}><Clock size={20} /></div>
              <div className={styles.featureTextInfo}>
                <span className={styles.featureTitle}>Approx. {approxHours} hours</span>
                <span className={styles.featureSub}>Complete in about {weeksToComplete} weeks</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
