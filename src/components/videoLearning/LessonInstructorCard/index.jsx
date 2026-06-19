import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LessonInstructorCard.module.css';

/**
 * 此时可能有现成的 InstructorCard，但由于在不同的页面设计图可能由于布局和字段存在差异
 * 为防止全局修改导致其他地方样式出错，故新建 LessonInstructorCard 组件予以隔离
 */
export default function LessonInstructorCard({ instructorDetails }) {
  const navigate = useNavigate();

  if (!instructorDetails) return null;

  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.instructorTitle}>Instructor</h3>
      
      <div className={styles.profileInfo}>
        {instructorDetails.avatar && (
           <img 
             src={instructorDetails.avatar} 
             alt={instructorDetails.name} 
             className={styles.avatar} 
           />
        )}
        <div className={styles.nameBlock}>
          <h4 className={styles.name}>{instructorDetails.name}</h4>
        </div>
      </div>

      {instructorDetails.bio && (
        <p className={styles.bio}>{instructorDetails.bio}</p>
      )}
    </div>
  );
}
