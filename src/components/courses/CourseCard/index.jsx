import { Link } from "react-router-dom";

import CourseProgress from "../CourseProgress";
import styles from "./CourseCard.module.css";

const cx = (...names) => names.map((name) => styles[name]).filter(Boolean).join(" ");

function getCourseDetailPath(course) {
  return `/course/${course.courseId ?? course.id}`;
}

function getCourseGamePath(course) {
  return `/course/${course.courseId ?? course.id}/game`;
}

export default function CourseCard({ course }) {
  return (
    <div className={`${styles.card} course-card-large`}>
      <Link
        to={getCourseDetailPath(course)}
        className={styles.cardLink}
        aria-label={`View details for ${course.title}`}
      />

      <div
        className={`${styles.image} course-image`}
        style={{ backgroundImage: `url(${course.image})` }}
      >
        <div className={`${cx("badge", course.badgeClass)} course-badge ${course.badgeClass || ""}`}>
          {course.status}
        </div>
      </div>

      <div className={`${styles.content} course-content`}>
        <span className={styles.courseId}>
          Course ID: {course.courseId ?? course.id}
        </span>
        <h3>{course.title}</h3>
        <p>{course.instructor}</p>

        <div className={`${styles.metaRow} course-meta-row`}>
          <div className={`${styles.meta} course-meta`}>
            <span>{course.rating}</span>
            <span>{course.reviews}</span>
          </div>

          <Link
            to={getCourseGamePath(course)}
            className={`${styles.actionIcon} course-action-icon`}
            aria-label={`Open game for ${course.title}`}
          >
            <img src={course.actionIcon} alt="" className={`${styles.gameIcon} game-icon`} />
          </Link>
        </div>

        <CourseProgress
          learnedSections={course.learnedSections}
          progress={course.progress}
          progressClass={course.progressClass}
          totalSections={course.totalSections}
        />
      </div>
    </div>
  );
}
