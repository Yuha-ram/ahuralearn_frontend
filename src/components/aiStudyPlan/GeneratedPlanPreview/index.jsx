import { useEffect, useState } from "react";
import { Database, FileCode2, Lock } from "lucide-react";

import styles from "./GeneratedPlanPreview.module.css";

const moduleIcons = {
  HTML: FileCode2,
  JS: FileCode2,
  DB: Database,
};

function AnimatedPlanPreview({ aiLogs, modules, onCreatePlan }) {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);

  useEffect(() => {
    const timers = aiLogs.map((log, index) =>
      window.setTimeout(() => {
        setVisibleLogs((currentLogs) => [...currentLogs, log]);

        if (index === aiLogs.length - 1) {
          window.setTimeout(() => {
            setIsGenerationComplete(true);
          }, 450);
        }
      }, index * 520)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [aiLogs]);

  return (
    <aside className={styles.previewCard}>
      <div className={styles.header}>
        <h2>Generated Plan Preview</h2>
        <span className={styles.liveBadge}>Live Updates</span>
      </div>

      <div className={styles.logicLabel}>AI Logic Logs</div>

      <div className={styles.terminal}>
        {visibleLogs.map((log) => (
          <p key={log}>› {log}</p>
        ))}
      </div>

      <h3>Recommended Modules</h3>

      <div className={styles.moduleList}>
        {modules.map((module) => {
          const Icon = moduleIcons[module.tag] ?? FileCode2;
          const isLocked = module.locked && !isGenerationComplete;

          return (
            <article
              className={`${isLocked ? styles.lockedModule : ""} ${
                !isLocked ? styles.generatedModule : ""
              }`}
              key={module.id}
            >
              <div className={styles.moduleIcon}>
                <Icon size={18} strokeWidth={2.3} />
              </div>

              <div>
                <h4>{module.title}</h4>
                <p>
                  {isLocked
                    ? module.generatingText
                    : `${module.duration} - ${module.priority}`}
                </p>
              </div>

              {isLocked && <Lock size={14} strokeWidth={2.2} />}
            </article>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!isGenerationComplete}
        onClick={onCreatePlan}
      >
        {isGenerationComplete ? "Create My Study Plan →" : "Generating Plan..."}
      </button>
    </aside>
  );
}

export default function GeneratedPlanPreview({ aiLogs, modules, onCreatePlan }) {
  return (
    <AnimatedPlanPreview
      key={aiLogs.join("|")}
      aiLogs={aiLogs}
      modules={modules}
      onCreatePlan={onCreatePlan}
    />
  );
}
