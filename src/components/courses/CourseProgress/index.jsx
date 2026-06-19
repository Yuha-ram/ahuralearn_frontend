import styles from "./CourseProgress.module.css";

const cx = (...names) => names.map((name) => styles[name]).filter(Boolean).join(" ");

export default function CourseProgress({
  learnedSections,
  progress,
  progressClass,
  totalSections,
}) {
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressHeader}>
        <span>Progress</span>
        <strong>{progress}%</strong>
      </div>

      <div className={`${styles.progress} course-progress`}>
        <div className={`${styles.line} progress-line`}>
          <div
            className={`${cx("fill", progressClass)} progress-fill ${progressClass || ""}`}
            style={{ "--progress-target": `${progress}%` }}
          ></div>
        </div>
        <span className={styles.sections}>
          {learnedSections}/{totalSections}
        </span>
      </div>
    </div>
  );
}
