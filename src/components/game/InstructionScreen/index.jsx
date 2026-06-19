import { useEffect, useState } from "react";

import styles from "./InstructionScreen.module.css";

import { getGameInstruction } from "../../../api/game/game";

export default function InstructionScreen({
  courseId,
  selectedGame,
  selectedDifficulty,
  onStart,
  onBack,
}) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstruction = async () => {
      if (!selectedGame?.id) {
        return;
      }

      setLoading(true);

      const data = await getGameInstruction(
        courseId,
        selectedGame.id
      );

      setInfo(data);
      setLoading(false);
    };

    fetchInstruction();
  }, [courseId, selectedGame]);

  if (loading || !info) {
    return (
      <div className={styles.instructionScreen}>
        <div className={styles.instructionCard}>
          <p className={styles.instructionLabel}>
            TRAINING BRIEF
          </p>

          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.instructionScreen}>
      <div className={styles.instructionCard}>
        <p className={styles.instructionLabel}>
          TRAINING BRIEF
        </p>

        <h1>{selectedGame?.title}</h1>

        <div className={styles.instructionGrid}>
          <div className={styles.instructionItem}>
            <span>Controls</span>
            <strong>{info.controls}</strong>
          </div>

          <div className={styles.instructionItem}>
            <span>Objective</span>
            <strong>{info.goal}</strong>
          </div>

          <div className={styles.instructionItem}>
            <span>Tips</span>
            <strong>{info.tips}</strong>
          </div>

          <div className={styles.instructionItem}>
            <span>Difficulty</span>
            <strong>{selectedDifficulty || "Easy"}</strong>
          </div>
        </div>

        <button
          className={styles.launchBtn}
          onClick={onStart}
        >
          Launch Training →
        </button>

        <button
          className={styles.backSelectBtn}
          onClick={onBack}
        >
          ← Back to Game Select
        </button>
      </div>
    </div>
  );
}