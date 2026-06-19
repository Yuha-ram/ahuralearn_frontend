import styles from "./ProficiencyLevel.module.css";

export default function ProficiencyLevel({ data }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  const progressOffset =
    circumference - (data.score / 100) * circumference;

  return (
    <div className={`${styles.card} ${styles.proficiencyCard}`}>

      <h2>
        Current Proficiency Level
      </h2>

      <div className={styles.progressRing}>

        <svg width="220" height="220">

          <circle
            className={styles.ringBg}
            cx="110"
            cy="110"
            r="78"
          />

          <circle
            className={styles.ringProgress}
            cx="110"
            cy="110"
            r="78"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: progressOffset,
            }}
          />

        </svg>

        <div className={styles.ringCenter}>

          <div className={styles.scoreNumber}>
            {data.score}
          </div>

          <div className={styles.scoreLevel}>
            {data.level}
          </div>

        </div>

      </div>

      <p className={styles.scoreText}>
        {data.description}
        <br />
        {data.message}
      </p>

    </div>
  );
}