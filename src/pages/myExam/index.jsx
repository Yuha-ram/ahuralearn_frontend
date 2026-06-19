import { useEffect, useState } from "react";

import styles from "./MyExam.module.css";

import PageShell from "../../components/profileLayout/PageShell";
import { getMyExamPageData } from "../../api/exam/exam";

import ExamResultCard from "../../components/myExam/ExamResultCard";
import SubjectBreakdown from "../../components/myExam/SubjectBreakdown";
import RecentExams from "../../components/myExam/RecentExams";

export default function MyExam() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadMyExamData() {
      try {
        setLoading(true);
        setError(null);

        const myExamData = await getMyExamPageData();

        if (!ignore) {
          setData(myExamData);
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMyExamData();

    return () => {
      ignore = true;
    };
  }, []);

  const empty =
    !loading &&
    !error &&
    (!data ||
      !data.result ||
      (data.subjects?.length ?? 0) === 0 ||
      (data.recentExams?.length ?? 0) === 0);

  if (loading) {
    return (
      <PageShell>
        <main className={`${styles.myExamPage} ${styles.pageStatus}`}>
          Loading...
        </main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className={`${styles.myExamPage} ${styles.pageStatus}`}>
          Failed to load exam data.
        </main>
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell>
        <main className={`${styles.myExamPage} ${styles.pageStatus}`}>
          No exam data found.
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className={styles.myExamPage}>
        <ExamResultCard result={data.result} />

        <section className={styles.examGrid}>
          <SubjectBreakdown subjects={data.subjects} />
          <RecentExams exams={data.recentExams} />
        </section>
      </main>
    </PageShell>
  );
}
