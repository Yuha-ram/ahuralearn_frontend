import { Clock3, GraduationCap, Route, Trophy } from "lucide-react";

import styles from "./LearningStats.module.css";

const statIcons = {
  courses: GraduationCap,
  hours: Clock3,
  certificates: Trophy,
  track: Route,
};

export default function LearningStats({ stats }) {
  return (
    <section className={styles.statsCard}>
      <h2>Learning Stats</h2>

      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = statIcons[stat.icon] ?? GraduationCap;

          return (
            <div className={styles.statItem} key={stat.id}>
              <div className={styles.icon}>
                <Icon size={24} strokeWidth={2.4} />
              </div>

              <div>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
