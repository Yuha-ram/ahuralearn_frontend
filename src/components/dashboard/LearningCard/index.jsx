import DashboardHeader from "../DashboardHeader";
import ProgressRing from "../ProgressRing";
import styles from "./LearningCard.module.css";

export default function LearningCard({ progress }) {
  return (
    <div className={styles.card}>
      <DashboardHeader title={progress.title} />

      <div className={styles.ringSlot}>
        <ProgressRing percentage={progress.percentage} label={progress.label} />
      </div>

      <div className={styles.progressText}>
        <h3>{progress.weeklyChange}</h3>
        <p>{progress.message}</p>
      </div>
    </div>
  );
}
