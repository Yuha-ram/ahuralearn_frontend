import { useEffect, useMemo, useState } from "react";

import AchievementSummary from "../../components/achievements/AchievementSummary";
import WeeklyGoals from "../../components/achievements/WeeklyGoals";
import PageShell from "../../components/profileLayout/PageShell";
import {
  addWeeklyGoal,
  deleteWeeklyGoal,
  getWeeklyGoals,
} from "../../api/learning/goals";
import { getAchievementsData } from "../../api/learning/achievements";
import styles from "./Achievements.module.css";

function createWeeklyGoal(newGoal) {
  return {
    id: Date.now(),
    title: newGoal.title,
    type: newGoal.type || "Learning",
    current: Number(newGoal.current) || 0,
    total: Number(newGoal.total),
    achieved: false,
    achievedDay: null,
    dueDay: newGoal.dueDay || "Friday",
  };
}

function Achievements() {
  const [data, setData] = useState(null);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [achievementsError, setAchievementsError] = useState(null);

  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalsError, setGoalsError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadAchievementsData() {
      try {
        setAchievementsLoading(true);
        setAchievementsError(null);

        const achievementsData = await getAchievementsData();

        if (!ignore) {
          setData(achievementsData);
        }
      } catch (err) {
        if (!ignore) {
          setAchievementsError(err);
        }
      } finally {
        if (!ignore) {
          setAchievementsLoading(false);
        }
      }
    }

    loadAchievementsData();

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

  const achievedGoals = useMemo(
    () => goals.filter((goal) => goal.achieved),
    [goals]
  );

  const addGoal = async (newGoal) => {
    const goal = createWeeklyGoal(newGoal);
    const createdGoal = await addWeeklyGoal(goal);

    setGoals((currentGoals) => [createdGoal, ...currentGoals]);

    return createdGoal;
  };

  const deleteGoal = async (id) => {
    await deleteWeeklyGoal(id);
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
  };

  const achievementsEmpty =
    !achievementsLoading &&
    !achievementsError &&
    (!data || !data.summary || (data.summary.totalAchievements ?? 0) === 0);

  const loading = achievementsLoading || goalsLoading;
  const error = achievementsError || goalsError;
  const empty = achievementsEmpty && achievedGoals.length === 0;

  if (loading) {
    return (
      <PageShell>
        <main className={styles.achievementsPage}>
          Loading achievements...
        </main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className={styles.achievementsPage}>
          Failed to load achievements
        </main>
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell>
        <main className={styles.achievementsPage}>
          No achievements yet
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className={styles.achievementsPage}>
        <AchievementSummary
          summary={data.summary}
          trophy={data.trophy}
        />

        <WeeklyGoals
          goals={goals}
          onAddGoal={addGoal}
          onDeleteGoal={deleteGoal}
        />
      </main>
    </PageShell>
  );
}

export default Achievements;
