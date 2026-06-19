import { useMemo, useState } from "react";

import CourseCard from "../CourseCard";
import styles from "./ContinueLearning.module.css";

const COURSES_PER_PAGE = 6;

export default function ContinueLearning({ courses }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(courses.length / COURSES_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const showPagination = totalPages > 1;

  const visibleCourses = useMemo(() => {
    const startIndex = (activePage - 1) * COURSES_PER_PAGE;

    return courses.slice(startIndex, startIndex + COURSES_PER_PAGE);
  }, [activePage, courses]);

  if (courses.length === 0) {
    return <section className={styles.grid}>No courses found</section>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {visibleCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {showPagination && (
        <div className={styles.pagination} aria-label="Course pagination">
          <button
            type="button"
            disabled={activePage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                type="button"
                className={page === activePage ? styles.activePage : ""}
                key={page}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            disabled={activePage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
