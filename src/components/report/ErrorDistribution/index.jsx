import styles from "./ErrorDistribution.module.css";

const colors = ["#ef5f8a", "#f6bf26", "#45a7e8"];

export default function ErrorDistribution({ data = [] }) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div className={`${styles.card} ${styles.errorCard}`}>
        <h2>Error Type Distribution</h2>
        <p>No error data available.</p>
      </div>
    );
  }

  let currentPercent = 0;

  const reportData = safeData.map((item, index) => {
    const value = Number(item.value ?? item.percentage ?? 0);
    const color = colors[index % colors.length];

    const start = currentPercent;
    const end = currentPercent + value;

    currentPercent = end;

    return {
      label: item.type ?? item.label ?? "Unknown Error",
      value,
      color,
      start,
      end,
    };
  });

  const gradient = `conic-gradient(${reportData
    .map(
      (item) =>
        `${item.color} ${item.start}% ${item.end}%`
    )
    .join(", ")})`;

  return (
    <div className={`${styles.card} ${styles.errorCard}`}>
      <h2>Error Type Distribution</h2>

      <div className={styles.pieChart}>
        <div
          className={styles.pie}
          style={{
            background: gradient,
          }}
        ></div>
      </div>

      <div className={styles.errorList}>
        {reportData.map((item) => (
          <div
            className={styles.errorItem}
            key={item.label}
          >
            <div className={styles.errorName}>
              <span
                className={styles.errorDot}
                style={{
                  backgroundColor: item.color,
                }}
              ></span>

              {item.label}
            </div>

            <strong>{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}