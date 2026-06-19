import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./StartScreen.module.css";

export default function StartScreen({ onStart }) {
  const [difficulty, setDifficulty] = useState("Easy");
  const navigate = useNavigate();

  const handleExit = () => {
    navigate("/courses");
  };

  return (
    <div className={styles.startScreen}>
      <button
        className={styles.exitBtn}
        onClick={handleExit}
      >
        ← Exit
      </button>

      <div className={`${styles.bgGlow} ${styles.glow1}`}></div>
      <div className={`${styles.bgGlow} ${styles.glow2}`}></div>

      <div className={`${styles.floating} ${styles.floating1}`}>
        ◫
      </div>

      <div className={`${styles.floating} ${styles.floating2}`}>
        $
      </div>

      <div className={`${styles.floating} ${styles.floating3}`}>
        ▤
      </div>

      <div className={`${styles.floating} ${styles.floating4}`}>
        +
      </div>

      <div className={styles.startCard}>
        <div className={styles.logoIcon}>
          ⚡
        </div>

        <h1>
          NEURAL
          <br />
          ARCADE
        </h1>

        <p>
          Train Reflex. Memory. Logic.
        </p>

        <div className={styles.difficultyWrapper}>
          {["Easy", "Medium", "Hard"].map((level) => (
            <span
              key={level}
              className={
                difficulty === level
                  ? `${styles.difficulty} ${styles.active}`
                  : styles.difficulty
              }
              onClick={() => setDifficulty(level)}
            >
              {level}
            </span>
          ))}
        </div>

        <button
         className={styles.startPlayBtn}
         onClick={() => onStart(difficulty)}
        >
         PLAY GAME →
        </button>
      </div>
    </div>
  );
}