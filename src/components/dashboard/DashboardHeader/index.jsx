import styles from "./DashboardHeader.module.css";

export default function DashboardHeader({ title }) {
  return <h2 className={styles.title}>{title}</h2>;
}
