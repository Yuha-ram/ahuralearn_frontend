import DailyProgress from "../DailyProgress";
import styles from "./LearningSummary.module.css";

export default function LearningSummary({ progress }) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <h1>{progress.title}</h1>

        <p>{progress.message}</p>

        <div className={styles.weekBadge}>{progress.weeklyChange}</div>
      </div>

      <DailyProgress percentage={progress.percentage} label={progress.label} />
    </div>
  );
}
