import styles from './progressOverview.module.css';

// 1. 在参数中解构接收 props，并设置默认值以防数据未加载时报错
const ProgressOverview = ({ 
  score = 0, 
  focusArea = "General", 
  strength = "N/A", 
  weakness = "N/A" 
}) => {
  return (
      <div className={`${styles.card} ${styles['hero-summary']}`}>
        <div className={styles['progress-label']}>
          Progress overview
        </div>
        <div className={styles['content-grid']}>
          <div className={styles['focus-section']}>
            <div>
              <div className={styles['focus-label']}>Current Focus</div>
            <div className={styles['focus-value']}>{focusArea}</div>
          </div>
          <div className={styles['score-badge']}>
              {score}%
            </div>
          </div>
          <div className={styles['stats-row']}>
            <div className={styles['stat-card-strength']}>
              <div className={styles['stat-label']}>Strength</div>
              {/* 4. 动态渲染强项 */}
              <div className={`${styles['stat-value']} ${styles['text-dark']}`}>{strength}</div>
            </div>
            <div className={styles['stat-card-weakness']}>
              <div className={styles['stat-label']}>Weakness</div>
              {/* 5. 动态渲染弱项 */}
              <div className={`${styles['stat-value']} ${styles['text-orange']}`}>{weakness}</div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default ProgressOverview;