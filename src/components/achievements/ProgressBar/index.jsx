import styles from "./ProgressBar.module.css";

// 通用进度条：summary 和 weekly goal 使用同一组件，通过 variant 区分样式。
export default function ProgressBar({ progress, variant = "goal" }) {
  return (
    <div className={`${styles.progressTrack} ${styles[variant]}`}>
      <div className={styles.progressFill} style={{ "--progress-target": `${progress}%` }} />
    </div>
  );
}
