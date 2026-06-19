import { games } from "../../../api/game/game";

import styles from "./GameSelectScreen.module.css";

export default function GameSelectScreen({
  onSelectGame,
  onBack,
}) {
  return (
    <div className={styles.gameSelectScreen}>
      <button
        className={styles.backSelectScreenBtn}
        onClick={onBack}
      >
        ← Back
      </button>

      <div className={styles.selectHeader}>
        <p>AI TRAINING ARCADE</p>

        <h1>
          Choose Your Challenge
        </h1>

        <span>
          Select a mini game to train reaction,
          memory, logic, and decision-making.
        </span>
      </div>

      <div className={styles.gameCardGrid}>
        {games.map((game) => (
          <button
            className={styles.gameCard}
            key={game.id}
            onClick={() => onSelectGame(game)}
          >
            <div>
              <div className={styles.gameIcon}>
                {game.icon}
              </div>

              <div className={styles.gameInfo}>
                <h2>
                  {game.title}
                </h2>

                <p>
                  {game.description}
                </p>
              </div>
            </div>

            <div className={styles.gameFooter}>
              <strong>
                Start →
              </strong>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}