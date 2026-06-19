import { Link } from "react-router-dom";

import StatsCard from "../StatsCard";
import styles from "./DashboardStats.module.css";

export default function DashboardStats({ courses, stats }) {
  return (
    <>
      <div className={styles.section}>
        <div className={styles.header}>
          <h2>Ongoing Courses</h2>
          <Link to="/courses" className={styles.viewAll}>
            View All
          </Link>
        </div>

        {courses.map((course) => (
          <div key={course.title} className={styles.courseCard}>
            <div className={styles.courseTop}>
              <h3>{course.title}</h3>
              <div className={styles.status}>{course.status}</div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ "--progress-target": `${course.progress}%` }}
              />
            </div>

            <div className={styles.courseBottom}>
              <span>{course.progress}% Complete</span>
              <span>{course.lessons}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.header}>
          <h2>Goals & Achievements</h2>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <StatsCard key={stat.label} stat={stat} className={styles.statCard} />
          ))}
        </div>
      </div>
    </>
  );
}
