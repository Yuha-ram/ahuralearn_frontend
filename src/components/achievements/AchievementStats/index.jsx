import styles from "./AchievementStats.module.css";

// 成就统计卡片组：负责把 summary 中整理好的统计项渲染成小卡片。
export default function AchievementStats({ stats }) {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <p>{stat.label}</p>
          <h2>{stat.value}</h2>
        </div>
      ))}
    </div>
  );
}
