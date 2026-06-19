import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import styles from "./Report.module.css";

import TopNav from "../../components/common/TopNav";
import Footer from "../../components/common/Footer";

import AIRecommendations from "../../components/report/AIRecommendations";
import ErrorDistribution from "../../components/report/ErrorDistribution";
import KnowledgeGap from "../../components/report/KnowledgeGap";
import ProficiencyLevel from "../../components/report/ProficiencyLevel";

import { getReportData } from "../../api/report/report";
import { getReportCourses } from "../../api/course/course";

export default function Report() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [courseOpen, setCourseOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      setError("");

      const courseList = await getReportCourses();

      setCourses(courseList);

      const courseIdFromUrl = Number(
        searchParams.get("courseId")
      );

      const defaultCourse =
        courseList.find(
          (course) => course.id === courseIdFromUrl
        ) || courseList[0];

      if (defaultCourse) {
        setSelectedCourse(defaultCourse);
        setSearchParams({
          courseId: defaultCourse.id,
        });
      }
    } catch (err) {
      setError("Failed to load courses.");
    }
  };

  const fetchReportData = async () => {
    if (!selectedCourse) {
      return;
    }

    try {
      setError("");
      setReportData(null);

      const data = await getReportData(
        selectedCourse.id
      );

      console.log("selected course:", selectedCourse);
      console.log("report data:", data);

      if (!data) {
        setError("Report data not found.");
        return;
      }

      setReportData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load analysis report.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchReportData();
    }
  }, [selectedCourse]);

  if (error) {
    return (
      <>
        <TopNav />

        <div className={styles.reportError}>
          <h2>{error}</h2>

          <button
            className={styles.refreshBtn}
            onClick={() => {
              if (selectedCourse) {
                fetchReportData();
              } else {
                fetchCourses();
              }
            }}
          >
            Try Again
          </button>
        </div>

        <Footer />
      </>
    );
  }

  if (!reportData) {
    return (
      <>
        <TopNav />

        <div className={styles.reportLoading}>
          <h2>Loading analysis report...</h2>

          <div className={styles.loadingCard}></div>
          <div className={styles.loadingCard}></div>
          <div className={styles.loadingCard}></div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <TopNav />

      <div className={styles.report}>
        <div className={styles.reportHeader}>
          <div>
            <h1>Intelligent Assessment Report</h1>

            <p>
              Personalized analysis of your recent{" "}
              {selectedCourse?.name} mid-term simulation.
            </p>
          </div>

          <div className={styles.courseSelect}>
            <button
              className={styles.courseSelectBtn}
              onClick={() =>
                setCourseOpen(!courseOpen)
              }
            >
              ▼ {selectedCourse?.name}
            </button>

            {courseOpen && (
              <div className={styles.courseMenu}>
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setSearchParams({
                        courseId: course.id,
                      });
                      setCourseOpen(false);
                    }}
                  >
                    {course.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.reportGrid}>
          <div className={styles.reportLeft}>
            <ProficiencyLevel
              data={reportData.proficiency}
            />

            <ErrorDistribution
              data={reportData.errors}
            />
          </div>

          <div className={styles.reportRight}>
            <KnowledgeGap
              data={reportData.knowledgeGap}
            />

            <AIRecommendations
              data={reportData.aiSuggestion}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}