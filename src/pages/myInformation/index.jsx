import { useEffect, useState } from "react";

import styles from "./MyInformation.module.css";

import PageShell from "../../components/profileLayout/PageShell";
import { getMyInformationPageData } from "../../api/user/user";

import ProfileCard from "../../components/myInformation/ProfileCard";
import LearningStats from "../../components/myInformation/LearningStats";
import LearningProfile from "../../components/myInformation/LearningProfile";

export default function MyInformation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadMyInformationData() {
      try {
        setLoading(true);
        setError(null);

        const myInformationData = await getMyInformationPageData();

        if (!ignore) {
          setData(myInformationData);
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

    loadMyInformationData();

    return () => {
      ignore = true;
    };
  }, []);

  const empty =
    !loading &&
    !error &&
    (!data || !data.profile || !data.learningProfile);

  if (loading) {
    return (
      <PageShell>
        <main className={`${styles.myInformationPage} ${styles.pageStatus}`}>
          Loading...
        </main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className={`${styles.myInformationPage} ${styles.pageStatus}`}>
          Failed to load profile data.
        </main>
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell>
        <main className={`${styles.myInformationPage} ${styles.pageStatus}`}>
          No profile data found.
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className={styles.myInformationPage}>
        <ProfileCard profile={data.profile} />

        <LearningStats stats={data.stats} />

        <LearningProfile learningProfile={data.learningProfile} />
      </main>
    </PageShell>
  );
}
