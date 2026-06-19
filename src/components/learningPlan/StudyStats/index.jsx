import { useMemo, useState } from "react";
import { Trash2, X } from "lucide-react";

import { showToast } from "../../common/toast";
import PlanHeader from "../PlanHeader";
import TaskCard from "../TaskCard";
import styles from "./StudyStats.module.css";

const emptyManualPlan = {
  title: "",
  dueText: "This Week",
  studyTime: "1h",
  priority: "Medium",
  note: "",
};

const dueRank = {
  "Due Today": 0,
  Today: 0,
  Tomorrow: 1,
  "This Week": 2,
  "Next Week": 3,
  Finished: 4,
};

const priorityRank = {
  High: 0,
  Medium: 1,
  Low: 2,
};

const TASKS_PER_PAGE = 3;

function getTaskPriority(task) {
  if (task.priority) {
    return task.priority;
  }

  const priorityTag = task.tags?.find((tag) =>
    tag.label.toLowerCase().includes("priority")
  );

  if (!priorityTag) {
    return "Medium";
  }

  if (priorityTag.label.toLowerCase().includes("high")) {
    return "High";
  }

  if (priorityTag.label.toLowerCase().includes("low")) {
    return "Low";
  }

  return "Medium";
}

function sortTasks(tasksToSort) {
  return [...tasksToSort].sort((firstTask, secondTask) => {
    const firstDueRank = dueRank[firstTask.dueText] ?? 99;
    const secondDueRank = dueRank[secondTask.dueText] ?? 99;

    if (firstDueRank !== secondDueRank) {
      return firstDueRank - secondDueRank;
    }

    return (
      (priorityRank[getTaskPriority(firstTask)] ?? 99) -
      (priorityRank[getTaskPriority(secondTask)] ?? 99)
    );
  });
}

export default function StudyStats({ planner }) {
  const [mode, setMode] = useState("none");
  const [tasks, setTasks] = useState(planner.tasks);
  const [manualPlan, setManualPlan] = useState(emptyManualPlan);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const visibleTasks = useMemo(() => {
    const filteredTasks =
      mode === "ai"
        ? tasks.filter((task) =>
            task.tags?.some((tag) => tag.label.toLowerCase().includes("ai"))
          )
        : tasks;

    return sortTasks(filteredTasks);
  }, [mode, tasks]);

  const totalPages = Math.max(1, Math.ceil(visibleTasks.length / TASKS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (activePage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = visibleTasks.slice(
    pageStartIndex,
    pageStartIndex + TASKS_PER_PAGE
  );
  const pageRangeStart = visibleTasks.length === 0 ? 0 : pageStartIndex + 1;
  const pageRangeEnd = Math.min(
    pageStartIndex + TASKS_PER_PAGE,
    visibleTasks.length
  );
  const shouldShowPagination = visibleTasks.length > TASKS_PER_PAGE;

  const handleToggleComplete = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const isDone = task.done || task.completed;

        return {
          ...task,
          completed: !isDone,
          done: !isDone,
          finished: !isDone,
          subtitle: !isDone
            ? "Completed just now"
            : task.tags
              ? task.subtitle
              : "Manual Entry",
          dueText: !isDone
            ? "Finished"
            : task.dueText === "Finished"
              ? "This Week"
              : task.dueText,
        };
      })
    );
  };

  const updateManualPlan = (field, value) => {
    setManualPlan((currentPlan) => ({
      ...currentPlan,
      [field]: value,
    }));
  };

  const resetManualPlan = () => {
    setManualPlan(emptyManualPlan);
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    setMode("manual");
    setEditingTaskId(task.id);
    setManualPlan({
      title: task.title,
      dueText: task.dueText === "Finished" ? "This Week" : task.dueText,
      studyTime: task.studyTime || "1h",
      priority: task.priority || getTaskPriority(task),
      note: task.note || "",
    });
  };

  const handleModeChange = (nextMode) => {
    setMode((currentMode) => (currentMode === nextMode ? "none" : nextMode));
    setCurrentPage(1);

    if (nextMode !== "manual") {
      resetManualPlan();
    }
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );

    if (editingTaskId === taskId) {
      resetManualPlan();
    }
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const closeDeleteDialog = () => {
    setTaskToDelete(null);
  };

  const confirmDeleteTask = () => {
    if (!taskToDelete) {
      return;
    }

    deleteTask(taskToDelete.id);
    closeDeleteDialog();
  };

  const handleSubmitManualTask = (event) => {
    event.preventDefault();

    const title = manualPlan.title.trim();

    if (!title) {
      showToast("Please enter a study plan title.", "warning");
      return;
    }

    const nextTask = {
      title,
      completed: false,
      subtitle: "Manual Entry",
      dueText: manualPlan.dueText,
      studyTime: manualPlan.studyTime,
      priority: manualPlan.priority,
      note: manualPlan.note.trim(),
    };

    if (editingTaskId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...nextTask,
              }
            : task
        )
      );
      showToast("Study plan updated successfully.", "success");
    } else {
      setTasks((currentTasks) => [
        {
          id: Date.now(),
          ...nextTask,
        },
        ...currentTasks,
      ]);
      setCurrentPage(1);
      showToast("Study plan added successfully.", "success");
    }

    resetManualPlan();
  };

  return (
    <div className={styles.card}>
      <PlanHeader
        title={planner.title}
        actions={planner.actions}
        activeMode={mode}
        onModeChange={handleModeChange}
      />

      {mode === "manual" && (
        <form className={styles.manualCard} onSubmit={handleSubmitManualTask}>
          <div className={styles.formHeader}>
            <div>
              <h3>{editingTaskId ? "Edit Study Plan" : "Create Study Plan"}</h3>
              <p>Customize the task, time, priority, and study note.</p>
            </div>

            {editingTaskId && (
              <button
                className={styles.ghostButton}
                type="button"
                onClick={resetManualPlan}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className={styles.formGrid}>
            <label className={styles.titleField}>
              Plan Title
              <input
                type="text"
                value={manualPlan.title}
                onChange={(event) =>
                  updateManualPlan("title", event.target.value)
                }
                placeholder="Write a new study plan"
                aria-label="New study plan title"
              />
            </label>

            <label>
              Due
              <select
                value={manualPlan.dueText}
                onChange={(event) =>
                  updateManualPlan("dueText", event.target.value)
                }
                aria-label="New study plan due date"
              >
                <option>This Week</option>
                <option>Due Today</option>
                <option>Tomorrow</option>
                <option>Next Week</option>
              </select>
            </label>

            <label>
              Study Time
              <select
                value={manualPlan.studyTime}
                onChange={(event) =>
                  updateManualPlan("studyTime", event.target.value)
                }
              >
                <option>30m</option>
                <option>1h</option>
                <option>1.5h</option>
                <option>2h</option>
                <option>3h</option>
              </select>
            </label>

            <label>
              Priority
              <select
                value={manualPlan.priority}
                onChange={(event) =>
                  updateManualPlan("priority", event.target.value)
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <label className={styles.noteField}>
              Study Note
              <textarea
                rows="3"
                value={manualPlan.note}
                onChange={(event) =>
                  updateManualPlan("note", event.target.value)
                }
                placeholder="Add chapters, resources, or review goals"
              />
            </label>
          </div>

          <button className={styles.submitButton} type="submit">
            {editingTaskId ? "Save Plan" : "Add Plan"}
          </button>
        </form>
      )}

      <div className={styles.taskList}>
        {paginatedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>

      {taskToDelete && (
        <div className={styles.dialogBackdrop} role="presentation">
          <div
            className={styles.confirmDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
          >
            <button
              type="button"
              className={styles.dialogClose}
              aria-label="Close delete confirmation"
              onClick={closeDeleteDialog}
            >
              <X size={17} strokeWidth={2.4} />
            </button>

            <div className={styles.dialogIcon}>
              <Trash2 size={22} strokeWidth={2.4} />
            </div>

            <h3 id="delete-task-title">Delete study plan?</h3>
            <p>This will remove "{taskToDelete.title}" from your study plan.</p>

            <div className={styles.dialogActions}>
              <button type="button" onClick={closeDeleteDialog}>
                Cancel
              </button>
              <button type="button" onClick={confirmDeleteTask}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {shouldShowPagination && (
        <div className={styles.pagination} aria-label="Study plan pagination">
          <p>
            {pageRangeStart}-{pageRangeEnd} of {visibleTasks.length} plans
          </p>

          <div className={styles.pageControls}>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={activePage === 1}
              aria-label="Previous page"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={
                    activePage === pageNumber ? styles.activePage : undefined
                  }
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-current={activePage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={activePage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
