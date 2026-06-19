import { useEffect, useMemo, useState } from "react";

import ExpiringPlanCard from "../../components/notifications/ExpiringPlanCard";
import PageShell from "../../components/profileLayout/PageShell";
import {
  acknowledgeNotification,
  deleteNotification,
  getNotificationsData,
} from "../../api/notification/notifications";
import styles from "./Notifications.module.css";

const NOTIFICATIONS_PER_PAGE = 4;
const notificationsUpdatedEvent = "notifications-updated";
const notificationStateKey = "__ahuralearnNotificationState";
const priorityRank = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function getNotificationState() {
  if (!window[notificationStateKey]) {
    window[notificationStateKey] = {
      acknowledgedPlanIds: [],
      deletedPlanIds: [],
    };
  }

  return window[notificationStateKey];
}

function getVisibleExpiringPlans(plans = []) {
  const { acknowledgedPlanIds, deletedPlanIds } = getNotificationState();

  return plans
    .filter((plan) => !deletedPlanIds.includes(plan.id))
    .map((plan) => ({
      ...plan,
      isAcknowledged: acknowledgedPlanIds.includes(plan.id),
    }));
}

function sortNotifications(plans) {
  return [...plans].sort((firstPlan, secondPlan) => {
    const dateDifference =
      new Date(firstPlan.dueDate).getTime() -
      new Date(secondPlan.dueDate).getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return (
      (priorityRank[firstPlan.priority] ?? 99) -
      (priorityRank[secondPlan.priority] ?? 99)
    );
  });
}

function prepareNotificationsData(data) {
  return {
    ...data,
    expiringPlans: sortNotifications(
      getVisibleExpiringPlans(data.expiringPlans ?? [])
    ),
  };
}

function acknowledgeExpiringPlan(planId) {
  const state = getNotificationState();

  if (!state.acknowledgedPlanIds.includes(planId)) {
    state.acknowledgedPlanIds = [...state.acknowledgedPlanIds, planId];
  }

  window.dispatchEvent(new Event(notificationsUpdatedEvent));
}

function deleteExpiringPlan(planId) {
  const state = getNotificationState();

  if (!state.deletedPlanIds.includes(planId)) {
    state.deletedPlanIds = [...state.deletedPlanIds, planId];
  }

  window.dispatchEvent(new Event(notificationsUpdatedEvent));
}

export default function Notifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadNotificationsData() {
      try {
        setLoading(true);
        setError(null);

        const notificationsData = await getNotificationsData();
        const preparedNotificationsData =
          prepareNotificationsData(notificationsData);

        if (!ignore) {
          setData(preparedNotificationsData);
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

    loadNotificationsData();

    return () => {
      ignore = true;
    };
  }, []);

  const expiringPlans = data?.expiringPlans ?? [];
  const empty = !loading && !error && expiringPlans.length === 0;

  const acknowledgePlan = async (planId) => {
    await acknowledgeNotification(planId);
    acknowledgeExpiringPlan(planId);

    setData((currentData) => ({
      ...currentData,
      expiringPlans: currentData.expiringPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              isAcknowledged: true,
            }
          : plan
      ),
    }));
  };

  const deletePlan = async (planId) => {
    await deleteNotification(planId);
    deleteExpiringPlan(planId);

    setData((currentData) => ({
      ...currentData,
      expiringPlans: currentData.expiringPlans.filter(
        (plan) => plan.id !== planId
      ),
    }));
  };

  const totalPages = Math.max(
    1,
    Math.ceil(expiringPlans.length / NOTIFICATIONS_PER_PAGE)
  );
  const activePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (activePage - 1) * NOTIFICATIONS_PER_PAGE;
  const paginatedPlans = useMemo(
    () =>
      expiringPlans.slice(
        pageStartIndex,
        pageStartIndex + NOTIFICATIONS_PER_PAGE
      ),
    [expiringPlans, pageStartIndex]
  );
  const pageRangeStart = expiringPlans.length === 0 ? 0 : pageStartIndex + 1;
  const pageRangeEnd = Math.min(
    pageStartIndex + NOTIFICATIONS_PER_PAGE,
    expiringPlans.length
  );
  const shouldShowPagination = expiringPlans.length > NOTIFICATIONS_PER_PAGE;

  if (loading) {
    return (
      <PageShell showSubNav={false}>
        <main className={`${styles.notificationsPage} ${styles.pageStatus}`}>
          Loading notifications...
        </main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell showSubNav={false}>
        <main className={`${styles.notificationsPage} ${styles.pageStatus}`}>
          Failed to load notifications
        </main>
      </PageShell>
    );
  }

  if (empty) {
    return (
      <PageShell showSubNav={false}>
        <main className={`${styles.notificationsPage} ${styles.pageStatus}`}>
          No expiring study plans
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell showSubNav={false}>
      <main className={styles.notificationsPage}>
        <section className={styles.header}>
          <div>
            <h1>Notifications</h1>
            <p>Study plans that are getting close to their deadline.</p>
          </div>

          <span>{expiringPlans.length} expiring</span>
        </section>

        <section className={styles.planList}>
          {paginatedPlans.map((plan) => (
            <ExpiringPlanCard
              key={plan.id}
              onAcknowledge={acknowledgePlan}
              onDelete={deletePlan}
              plan={plan}
            />
          ))}
        </section>

        {shouldShowPagination && (
          <nav
            className={styles.pagination}
            aria-label="Notifications pagination"
          >
            <p>
              {pageRangeStart}-{pageRangeEnd} of {expiringPlans.length} alerts
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
                    aria-current={
                      activePage === pageNumber ? "page" : undefined
                    }
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
          </nav>
        )}
      </main>
    </PageShell>
  );
}
