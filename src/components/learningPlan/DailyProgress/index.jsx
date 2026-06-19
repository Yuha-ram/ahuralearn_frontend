import styles from "./DailyProgress.module.css";

export default function DailyProgress({ percentage, label }) {
  return (
    <div className={styles.circle}>
      <div className={styles.innerCircle}>
        <h2>{percentage}%</h2>

        <span>{label}</span>
      </div>
    </div>
  );
}
