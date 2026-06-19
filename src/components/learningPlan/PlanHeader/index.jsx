import styles from "./PlanHeader.module.css";

export default function PlanHeader({ title, actions, activeMode, onModeChange }) {
  return (
    <div className={styles.header}>
      <h2>{title}</h2>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${
            activeMode === "manual" ? styles.activeManual : styles.manualBtn
          }`}
          type="button"
          onClick={() => onModeChange("manual")}
        >
          {actions[0]}
        </button>

        <button
          className={`${styles.actionBtn} ${
            activeMode === "ai" ? styles.activeAi : styles.aiBtn
          }`}
          type="button"
          onClick={() => onModeChange("ai")}
        >
          {actions[1]}
        </button>
      </div>
    </div>
  );
}
