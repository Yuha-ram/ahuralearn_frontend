import styles from "./CourseHeader.module.css";

export default function CourseHeader({ summary, filters, activeFilter, onFilterChange }) {
  return (
    <div className={styles.header}>
      <div>
        <h1>My Courses</h1>
        <p>{summary}</p>
      </div>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={filter === activeFilter ? styles.active : undefined}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
