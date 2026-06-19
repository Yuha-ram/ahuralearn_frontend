import styles from "./StatsCard.module.css";

export default function StatsCard({ stat, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`}>
      <h3 className={styles.value}>{stat.value}</h3>
      <p className={styles.label}>{stat.label}</p>
    </div>
  );
}
