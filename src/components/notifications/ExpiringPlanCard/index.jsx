import { useState } from "react";
import { AlertCircle, CalendarDays, ChevronDown, Trash2 } from "lucide-react";

import styles from "./ExpiringPlanCard.module.css";

export default function ExpiringPlanCard({ onAcknowledge, onDelete, plan }) {
  const [expanded, setExpanded] = useState(false);

  const handleAcknowledge = (event) => {
    event.stopPropagation();

    if (!plan.isAcknowledged) {
      onAcknowledge(plan.id);
    }
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(plan.id);
  };

  const toggleExpanded = () => {
    setExpanded((current) => !current);
  };

  return (
    <article
      aria-expanded={expanded}
      className={`${styles.card} ${expanded ? styles.expandedCard : ""}`}
      role="button"
      tabIndex={0}
      onClick={toggleExpanded}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleExpanded();
        }
      }}
    >
      <div className={styles.iconWrap}>
        <AlertCircle size={24} strokeWidth={2.4} />
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div>
            <h2>{plan.title}</h2>
            <p>{plan.courseName}</p>
          </div>

          <span className={styles.priority}>{plan.priority}</span>
        </div>

        <div className={styles.metaRow}>
          <span>
            <CalendarDays size={16} strokeWidth={2.3} />
            Due {plan.dueDate}
          </span>

          <strong>{plan.daysLeft} days left</strong>

          <span className={styles.status}>{plan.status}</span>
        </div>

        {expanded && (
          <div className={styles.detailsPanel}>
            <p className={styles.description}>
              {plan.description}
            </p>

            <div className={styles.detailGrid}>
              <div>
                <span>Progress</span>
                <strong>{plan.progress}%</strong>
              </div>

              <div>
                <span>Estimated time</span>
                <strong>{plan.estimatedTime}</strong>
              </div>

              <div>
                <span>Track</span>
                <strong>{plan.owner}</strong>
              </div>

              <div>
                <span>Last updated</span>
                <strong>{plan.lastUpdated}</strong>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h3>Next steps</h3>

              <ul>
                {plan.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className={styles.actionRow}>
          <span className={styles.expandHint}>
            <ChevronDown
              className={expanded ? styles.chevronOpen : ""}
              size={16}
              strokeWidth={2.4}
            />
            {expanded ? "Hide details" : "View details"}
          </span>

          <button
            className={styles.ackButton}
            disabled={plan.isAcknowledged}
            type="button"
            onClick={handleAcknowledge}
          >
            {plan.isAcknowledged ? "Acknowledged" : "Got it"}
          </button>

          <button
            aria-label={`Delete notification for ${plan.title}`}
            className={styles.deleteButton}
            type="button"
            onClick={handleDelete}
          >
            <Trash2 size={16} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </article>
  );
}
