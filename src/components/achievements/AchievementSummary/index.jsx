import AchievementStats from "../AchievementStats";
import ProgressBar from "../ProgressBar";
import TrophyCard from "../TrophyCard";
import styles from "./AchievementSummary.module.css";

export default function AchievementSummary({ summary, trophy }) {
  // 页面顶部的核心成就数据，保持展示层只关心 label 和 value。
  const stats = [
    {
      label: "TOTAL ACHIEVEMENTS",
      value: summary.totalAchievements,
    },
    {
      label: "CERTIFICATES EARNED",
      value: summary.certificatesEarned,
    },
  ];

  return (
    <section className={styles.summaryCard}>
      <div className={styles.summaryContent}>
        <div className={styles.summaryLeft}>
          <h1>My Achievements Summary</h1>
          <p className={styles.lead}>
            Your learning journey is reaching new heights. Keep up the momentum!
          </p>

          <AchievementStats stats={stats} />

          {/* 认证进度与 trophy 视觉分开渲染，方便后续接入更多认证类型。 */}
          <div className={styles.milestoneRow}>
            <p>
              Certification Progress: <span>{summary.certificationName}</span>
            </p>
            <strong>{summary.progress}%</strong>
          </div>

          <ProgressBar progress={summary.progress} variant="summary" />
        </div>

        <TrophyCard trophy={trophy} />
      </div>
    </section>
  );
}
