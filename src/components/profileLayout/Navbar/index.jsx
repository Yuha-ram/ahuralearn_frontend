import { NavLink } from "react-router-dom";

import styles from "./Navbar.module.css";

export default function SubNav() {
  return (
    <div className={styles.subnav}>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${styles.navLink} ${
            isActive ? styles.active : ""
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/courses"
        className={({ isActive }) =>
          `${styles.navLink} ${
            isActive ? styles.active : ""
          }`
        }
      >
        Courses
      </NavLink>

      <NavLink
        to="/learningPlan"
        className={({ isActive }) =>
          `${styles.navLink} ${
            isActive ? styles.active : ""
          }`
        }
      >
        Learning Plan
      </NavLink>

      <NavLink
        to="/achievements"
        className={({ isActive }) =>
          `${styles.navLink} ${
            isActive ? styles.active : ""
          }`
        }
      >
        Achievements
      </NavLink>

      <NavLink
        to="/myExam"
        className={({ isActive }) =>
          `${styles.navLink} ${
            isActive ? styles.active : ""
          }`
        }
      >
        My Exam
      </NavLink>

      <NavLink
        to="/myInformation"
        className={({ isActive }) =>
          `${styles.navLink} ${
            isActive ? styles.active : ""
          }`
        }
      >
        My Information
      </NavLink>
    </div>
  );
}
