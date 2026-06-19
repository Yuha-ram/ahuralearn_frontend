import styles from "./TaskCard.module.css";

const cx = (...names) => names.map((name) => styles[name]).filter(Boolean).join(" ");

export default function TaskCard({ task, onDelete, onEdit, onToggleComplete }) {
  const isDone = task.done || task.completed;
  const priorityClass = task.priority
    ? `priority${task.priority}`
    : "priorityMedium";

  return (
    <div className={cx("taskItem", task.active && !isDone && "active", isDone && "finished")}>
      <div className={styles.taskLeft}>
        <button
          className={cx("taskCheck", isDone && "done")}
          type="button"
          aria-label={isDone ? "Mark task as incomplete" : "Mark task as complete"}
          onClick={() => onToggleComplete(task.id)}
        ></button>

        <div>
          <h3>{task.title}</h3>

          {task.tags ? (
            <div className={styles.taskTags}>
              {task.tags.map((tag) => (
                <span key={tag.label} className={styles[tag.className]}>
                  {tag.label}
                </span>
              ))}
            </div>
          ) : (
            <>
              <div className={styles.manualMeta}>
                <span>{task.subtitle}</span>
                {task.studyTime && <span>{task.studyTime}</span>}
                {task.priority && (
                  <span className={styles[priorityClass]}>
                    {task.priority} Priority
                  </span>
                )}
              </div>

              {task.note && <p>{task.note}</p>}
            </>
          )}
        </div>
      </div>

      <div className={styles.taskRight}>
        <span className={task.active && !isDone ? styles.dueText : styles.taskGray}>
          {isDone ? "Finished" : task.dueText}
        </span>

        <div className={styles.taskActions}>
          <button type="button" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(task)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
