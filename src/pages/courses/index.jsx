import { useEffect, useMemo, useState } from "react";

import ContinueLearning from "../../components/courses/ContinueLearning";
import CourseHeader from "../../components/courses/CourseHeader";
import CourseStats from "../../components/courses/CourseStats";
import PageShell from "../../components/profileLayout/PageShell";
import { getCoursesPageData } from "../../api/course/course";
import {
  deleteWeeklyGoal,
  getWeeklyGoals,
} from "../../api/learning/goals";
import styles from "./Courses.module.css";

export default function Courses() {
  const [coursesData, setCoursesData] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalsError, setGoalsError] = useState(null);

  const [activeFilter, setActiveFilter] = useState("All");
  const [goalToDelete, setGoalToDelete] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadCoursesData() {
      try {
        setCoursesLoading(true);
        setCoursesError(null);

        const data = await getCoursesPageData();

        if (!ignore) {
          setCoursesData(data);
        }
      } catch (err) {
        if (!ignore) {
          setCoursesError(err);
        }
      } finally {
        if (!ignore) {
          setCoursesLoading(false);
        }
      }
    }

    loadCoursesData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadWeeklyGoals() {
      try {
        setGoalsLoading(true);
        setGoalsError(null);

        const weeklyGoals = await getWeeklyGoals();

        if (!ignore) {
          setGoals(weeklyGoals);
        }
      } catch (err) {
        if (!ignore) {
          setGoalsError(err);
        }
      } finally {
        if (!ignore) {
          setGoalsLoading(false);
        }
      }
    }

    loadWeeklyGoals();

    return () => {
      ignore = true;
    };
  }, []);

  const activeGoals = useMemo(
    () => goals.filter((goal) => !goal.achieved),
    [goals]
  );

  const filteredCourses = useMemo(() => {
    if (!coursesData) {
      return [];
    }

    if (activeFilter === "All") {
      return coursesData.courses;
    }

    return coursesData.courses.filter(
      (course) => course.status.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter, coursesData]);

  const closeDeleteDialog = () => {
    setGoalToDelete(null);
  };

  const confirmDeleteGoal = async () => {
    if (!goalToDelete) {
      return;
    }

    await deleteWeeklyGoal(goalToDelete.id);
    setGoals((currentGoals) =>
      currentGoals.filter((goal) => goal.id !== goalToDelete.id)
    );
    closeDeleteDialog();
  };

  const empty =
    !coursesLoading &&
    !coursesError &&
    (!coursesData || (coursesData.courses?.length ?? 0) === 0);
  const loading = coursesLoading || goalsLoading;
  const error = coursesError || goalsError;

  if (loading) {
    return (
      <PageShell>
        <main className={styles.coursesPage}>Loading...</main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className={styles.coursesPage}>Failed to load data</main>
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell>
        <main className={styles.coursesPage}>No courses found</main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className={styles.coursesPage}>
        <CourseHeader
          summary={coursesData.summary}
          filters={coursesData.filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className={styles.coursesLayout}>
          <ContinueLearning courses={filteredCourses} />
          <CourseStats
            categories={coursesData.categories}
            goal={coursesData.goal}
            goals={activeGoals}
            goalToDelete={goalToDelete}
            onRequestDeleteGoal={setGoalToDelete}
            onCancelDeleteGoal={closeDeleteDialog}
            onConfirmDeleteGoal={confirmDeleteGoal}
          />
        </div>
      </main>
    </PageShell>
  );
}
