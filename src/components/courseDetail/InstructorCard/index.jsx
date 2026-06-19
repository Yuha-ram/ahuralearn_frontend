import React from 'react';
import { Star, GraduationCap, PlayCircle } from 'lucide-react';
import styles from './InstructorCard.module.css';

export default function InstructorCard({ instructorData }) {
  if (!instructorData) return null;

  const { name, avatar, bio, rating, studentCount, courseCount, students, lessons } = instructorData;
  const displayStudents = studentCount ?? students ?? 0;
  const displayCourses = courseCount ?? lessons ?? 0;

  const formattedRating = typeof rating === 'number' ? rating.toFixed(1) : (rating || 0);

  const formatStudents = (num) => {
    if (!num) return '0';
    if (num >= 100) {
      const rounded = Math.floor(num / 100) * 100;
      return `${rounded.toLocaleString()}+`;
    }
    return `${num}`;
  };

  return (
    <div className={styles.instructorCardBox}>
      <h3 className={styles.instructorMainTitle}>Instructor</h3>

      <div className={styles.instructorProfileArea}>
        {avatar && <img src={avatar} alt={name} className={styles.largeAvatar} />}
        <div className={styles.instructorNameBox}>
          <span className={styles.instructorDetailName}>{name}</span>
        </div>
      </div>

      <p className={styles.instructorBio}>{bio}</p>

      <div className={styles.instructorStatsList}>
        <div className={styles.statItem}>
          <Star className={styles.statIcon} size={18} />
          <span className={styles.statText}>{formattedRating} Instructor Rating</span>
        </div>
        <div className={styles.statItem}>
          <GraduationCap className={styles.statIcon} size={18} />
          <span className={styles.statText}>{formatStudents(displayStudents)} Students</span>
        </div>
        <div className={styles.statItem}>
          <PlayCircle className={styles.statIcon} size={18} />
          <span className={styles.statText}>{displayCourses || 0} Courses</span>
        </div>
      </div>
    </div>
  );
}
