import styles from "./KnowledgeGap.module.css";

export default function KnowledgeGap({ data = [] }) {
  const safeData = Array.isArray(data) ? data : [];
  const maxRadius = 90;

  if (safeData.length === 0) {
    return (
      <div className={styles.knowledgeCard}>
        <h2 className={styles.knowledgeTitle}>
          Knowledge Gap Analysis
        </h2>
        <p>No knowledge gap data available.</p>
      </div>
    );
  }

  const points = safeData.map((item, index) => {
    const angle = ((-90 + index * 60) * Math.PI) / 180;
    const radius = (item.value / 100) * maxRadius;

    const x = 50 + (radius * Math.cos(angle)) / 2;
    const y = 50 + (radius * Math.sin(angle)) / 2;

    return `${x}% ${y}%`;
  });

  const polygon = `polygon(${points.join(",")})`;

  return (
    <div className={styles.knowledgeCard}>
      <h2 className={styles.knowledgeTitle}>
        Knowledge Gap Analysis
      </h2>

      <div className={styles.knowledgeContent}>
        <div className={styles.radarWrapper}>
          <div className={`${styles.hexagon} ${styles.hex1}`}></div>
          <div className={`${styles.hexagon} ${styles.hex2}`}></div>
          <div className={`${styles.hexagon} ${styles.hex3}`}></div>
          <div className={`${styles.hexagon} ${styles.hex4}`}></div>
          <div className={`${styles.hexagon} ${styles.hex5}`}></div>

          <div className={styles.radarLines}>
            <div className={`${styles.radarLine} ${styles.vertical}`}></div>
            <div className={`${styles.radarLine} ${styles.diagonalLeft}`}></div>
            <div className={`${styles.radarLine} ${styles.diagonalRight}`}></div>
          </div>

          <div
            className={styles.dataShape}
            style={{
              clipPath: polygon,
            }}
          ></div>

          {safeData[0] && (
            <span className={`${styles.label} ${styles.top}`}>
              {safeData[0].label}
            </span>
          )}

          {safeData[1] && (
            <span className={`${styles.label} ${styles.rightTop}`}>
              {safeData[1].label}
            </span>
          )}

          {safeData[2] && (
            <span className={`${styles.label} ${styles.rightBottom}`}>
              {safeData[2].label}
            </span>
          )}

          {safeData[3] && (
            <span className={`${styles.label} ${styles.bottom}`}>
              {safeData[3].label}
            </span>
          )}

          {safeData[4] && (
            <span className={`${styles.label} ${styles.leftBottom}`}>
              {safeData[4].label}
            </span>
          )}

          {safeData[5] && (
            <span className={`${styles.label} ${styles.leftTop}`}>
              {safeData[5].label}
            </span>
          )}
        </div>

        <div className={styles.gapDetails}>
          {safeData.map((item, index) => (
            <div className={styles.gapItem} key={item.label}>
              <div className={styles.gapHeader}>
                <span>{item.label}</span>
                <strong>{item.value}%</strong>
              </div>

              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{
                    "--target-width": `${item.value}%`,
                    animationDelay: `${index * 0.12}s`,
              }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}