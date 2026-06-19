import styles from "./ResultScreen.module.css";

export default function ResultScreen({
  selectedGame,
  result,
  onRestart,
  onBackToMenu,
}) {
  const gameScore = result?.score ?? 0;
  const quizScore = result?.quizScore ?? 0;

  const finalScore =
    result?.finalScore ??
    gameScore + quizScore;

  return (
    <div className={styles.resultScreen}>

      <div className={styles.resultCard}>

        <p className={styles.resultLabel}>
          TRAINING COMPLETE
        </p>

        <h1>
          {selectedGame?.title}
        </h1>

        <p className={styles.resultText}>
          Your performance has been analyzed.
        </p>

        <div className={styles.resultStats}>

          <div className={styles.resultStat}>
            <span>Game Score</span>

            <strong>
              {gameScore}
            </strong>
          </div>

          <div className={styles.resultStat}>
            <span>Quiz Score</span>

            <strong>
              {quizScore}
            </strong>
          </div>

          <div className={styles.resultStat}>
            <span>Final Score</span>

            <strong>
              {finalScore}
            </strong>
          </div>

        </div>

        <div className={styles.resultStats}>

          <div className={styles.resultStat}>
            <span>Quiz Accuracy</span>

            <strong>
              {result?.correctAnswers ?? 0}
              /
              {result?.totalQuestions ?? 0}
            </strong>
          </div>

          <div className={styles.resultStat}>
            <span>Game Accuracy</span>

            <strong>
              {result?.accuracy ?? 0}%
            </strong>
          </div>

          <div className={styles.resultStat}>
            <span>Rank</span>

            <strong>
              {result?.rank ?? "C"}
            </strong>
          </div>

        </div>

        <div className={styles.resultButtons}>

          <button
            className={styles.restartBtn}
            onClick={onRestart}
          >
            Play Again
          </button>

          <button
            className={styles.menuBtn}
            onClick={onBackToMenu}
          >
            Main Menu
          </button>

        </div>

      </div>

    </div>
  );
}