import { Trophy } from "lucide-react";

import styles from "./TrophyCard.module.css";

// Trophy 仅作为成就/认证的视觉符号，不绑定具体徽章系统。
export default function TrophyCard({ trophy }) {
  return (
    <div className={styles.trophyCard} aria-label={trophy.title}>
      <Trophy size={76} strokeWidth={3.2} />
    </div>
  );
}
