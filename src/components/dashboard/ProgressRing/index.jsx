import styles from "./ProgressRing.module.css";

export default function ProgressRing({ percentage, label }) {
  return (
    <div
      className={styles.progressCircle}
      style={{
        "--progress-target": percentage,
        "--progress-deg": `${percentage * 3.6}deg`,
      }}
    >
      <div className={styles.innerCircle}>
        <h1>{percentage}%</h1>
        <p>{label}</p>
      </div>
    </div>
  );
}
