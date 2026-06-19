import { useEffect, useState } from "react";

import DashboardStats from "../../components/dashboard/DashboardStats";
import LearningCard from "../../components/dashboard/LearningCard";
import PageShell from "../../components/profileLayout/PageShell";
import { getDashboardData } from "../../api/learning/dashboard";
import { getLearningProgress } from "../../api/learning/progress";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadDashboardData() {
      try {
        setDashboardLoading(true);
        setDashboardError(null);

        const data = await getDashboardData();

        if (!ignore) {
          setDashboardData(data);
        }
      } catch (err) {
        if (!ignore) {
          setDashboardError(err);
        }
      } finally {
        if (!ignore) {
          setDashboardLoading(false);
        }
      }
    }

    loadDashboardData();

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

  const dashboardEmpty =
    !dashboardLoading &&
    !dashboardError &&
    (!dashboardData ||
      ((dashboardData.ongoingCourses?.length ?? 0) === 0 &&
        (dashboardData.achievementStats?.length ?? 0) === 0));

  const loading = dashboardLoading || progressLoading;
  const error = dashboardError || progressError;
  const empty = dashboardEmpty || !progress;

  if (loading) {
    return (
      <PageShell>
        <main className={styles.dashboard}>Loading...</main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className={styles.dashboard}>Failed to load data</main>
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell>
        <main className={styles.dashboard}>No dashboard data found</main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className={styles.dashboard}>
        <section className={styles.leftSection}>
          <LearningCard progress={progress} />
        </section>

        <section className={styles.rightSection}>
          <DashboardStats
            courses={dashboardData.ongoingCourses}
            stats={dashboardData.achievementStats}
          />
        </section>
      </main>
    </PageShell>
  );
}
