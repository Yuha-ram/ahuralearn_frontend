import { useEffect, useState } from "react";

import LearningSummary from "../../components/learningPlan/LearningSummary";
import StudyStats from "../../components/learningPlan/StudyStats";
import PageShell from "../../components/profileLayout/PageShell";
import { getLearningPlanData } from "../../api/learning/learningPlan";
import { getLearningProgress } from "../../api/learning/progress";
import styles from "./LearningPlan.module.css";

const generatedAIStudyPlanKey = "ahuralearn:generatedAIStudyPlan";

function getStoredGeneratedAIStudyPlan() {
  try {
    const storedPlan = localStorage.getItem(generatedAIStudyPlanKey);

    return storedPlan ? JSON.parse(storedPlan) : null;
  } catch (err) {
    console.warn("Failed to read generated AI study plan", err);
    return null;
  }
}

function getPriority(priorityText) {
  const normalizedPriority = priorityText?.toLowerCase() ?? "";

  if (
    normalizedPriority.includes("high") ||
    normalizedPriority.includes("essential")
  ) {
    return "High";
  }

  if (normalizedPriority.includes("low")) {
    return "Low";
  }

  return "Medium";
}

function createAITasks(generatedPlan) {
  return (generatedPlan?.modules ?? []).map((module, index) => {
    const priority = getPriority(module.priority);

    return {
      id: `ai-generated-${module.id ?? index}`,
      title: module.title,
      studyTime: module.duration,
      completed: false,
      dueText: index === 0 ? "Due Today" : index === 1 ? "Tomorrow" : "This Week",
      priority,
      active: index === 0,
      note: generatedPlan.summary,
      tags: [
        {
          label: "AI SUGGESTION",
          className: "ai-tag",
        },
        {
          label: `Priority ${priority}`,
          className: "priority-tag",
        },
      ],
    };
  });
}

function mergeGeneratedAIStudyPlan(data) {
  const generatedPlan = getStoredGeneratedAIStudyPlan();
  const generatedTasks = createAITasks(generatedPlan);

  if (generatedTasks.length === 0) {
    return data;
  }

  const regularTasks = data.planner.tasks.filter(
    (task) => !String(task.id).startsWith("ai-generated-")
  );

  return {
    ...data,
    planner: {
      ...data.planner,
      tasks: [...generatedTasks, ...regularTasks],
    },
  };
}

export default function LearningPlan() {
  const [learningPlanData, setLearningPlanData] = useState(null);
  const [learningPlanLoading, setLearningPlanLoading] = useState(true);
  const [learningPlanError, setLearningPlanError] = useState(null);

  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadLearningPlanData() {
      try {
        setLearningPlanLoading(true);
        setLearningPlanError(null);

        const data = await getLearningPlanData();
        const preparedData = mergeGeneratedAIStudyPlan(data);

        if (!ignore) {
          setLearningPlanData(preparedData);
        }
      } catch (err) {
        if (!ignore) {
          setLearningPlanError(err);
        }
      } finally {
        if (!ignore) {
          setLearningPlanLoading(false);
        }
      }
    }

    loadLearningPlanData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadLearningProgress() {
      try {
        setProgressLoading(true);
        setProgressError(null);

        const learningProgress = await getLearningProgress();

        if (!ignore) {
          setProgress(learningProgress);
        }
      } catch (err) {
        if (!ignore) {
          setProgressError(err);
        }
      } finally {
        if (!ignore) {
          setProgressLoading(false);
        }
      }
    }

    loadLearningProgress();

    return () => {
      ignore = true;
    };
  }, []);

  const learningPlanEmpty =
    !learningPlanLoading &&
    !learningPlanError &&
    (!learningPlanData ||
      (learningPlanData.planner?.tasks?.length ?? 0) === 0);

  const loading = learningPlanLoading || progressLoading;
  const error = learningPlanError || progressError;
  const empty = learningPlanEmpty || !progress;

  if (loading) {
    return (
      <PageShell>
        <main className={styles.learningPage}>Loading...</main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className={styles.learningPage}>Failed to load data</main>
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell>
        <main className={styles.learningPage}>No learning tasks found</main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className={styles.learningPage}>
        <LearningSummary progress={progress} />
        <StudyStats planner={learningPlanData.planner} />
      </main>
    </PageShell>
  );
}
