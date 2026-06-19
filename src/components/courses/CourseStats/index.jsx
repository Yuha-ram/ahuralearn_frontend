import { Trash2, X } from "lucide-react";

import styles from "./CourseStats.module.css";

export default function CourseStats({
  categories,
  goal,
  goals,
  goalToDelete,
  onRequestDeleteGoal,
  onCancelDeleteGoal,
  onConfirmDeleteGoal,
}) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarCard}>
        <h3>Course Categories</h3>

        {categories.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
            <img src={category.icon} alt="" className={styles.categoryIcon} />
            <span>{category.title}</span>
            <span>{category.count}</span>
          </div>
        ))}
      </div>

      <div className={styles.weeklyGoalsPanel}>
        {goals.map((weeklyGoal) => {
          const progress =
            weeklyGoal.total > 0
              ? Math.round((weeklyGoal.current / weeklyGoal.total) * 100)
              : 0;

          return (
            <div key={weeklyGoal.id} className={styles.goalCard}>
              <div className={styles.goalTop}>
                <img src={goal.icon} alt="" className={styles.goalImage} />
                <p className={styles.goalLabel}>{goal.label}</p>
                <button
                  type="button"
                  className={styles.deleteButton}
                  aria-label={`Delete ${weeklyGoal.title}`}
                  onClick={() => onRequestDeleteGoal(weeklyGoal)}
                >
                  <Trash2 size={15} strokeWidth={2.3} />
                </button>
              </div>

              <h4>{weeklyGoal.title}</h4>

              <div className={styles.goalLine}>
                <div
                  className={styles.goalFill}
                  style={{ "--goal-progress": `${progress}%` }}
                />
              </div>

              <span>
                {weeklyGoal.current}/{weeklyGoal.total}
              </span>
            </div>
          );
        })}
      </div>

      {goalToDelete && (
        <div className={styles.dialogBackdrop} role="presentation">
          <div
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-goal-title"
          >
            <button
              type="button"
              className={styles.dialogClose}
              aria-label="Close delete confirmation"
              onClick={onCancelDeleteGoal}
            >
              <X size={17} strokeWidth={2.4} />
            </button>

            <div className={styles.dialogIcon}>
              <Trash2 size={22} strokeWidth={2.4} />
            </div>

            <h3 id="delete-goal-title">Delete weekly goal?</h3>
            <p>
              This will remove "{goalToDelete.title}" from your weekly goals.
            </p>

            <div className={styles.dialogActions}>
              <button type="button" onClick={onCancelDeleteGoal}>
                Cancel
              </button>
              <button type="button" onClick={onConfirmDeleteGoal}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
