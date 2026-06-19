import styles from "./RecommendedModules.module.css";

export default function RecommendedModules({ modules }) {
  return (
    <aside className={styles.modulesCard}>
      <h2>Recommended Modules</h2>

      <div className={styles.moduleList}>
        {modules.map((module) => (
          <article key={module.id}>
            <div>
              <h3>{module.title}</h3>
              <p>{module.duration}</p>
            </div>
            <span>{module.priority}</span>
          </article>
        ))}
      </div>
    </aside>
  );
}
