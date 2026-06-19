import styles from "./PlayScreen.module.css";

import CodeFirewall from "../CodeFirewall";
import KnowledgeDefense from "../KnowledgeDefense";
import MiniPacman from "../MiniPacman";
import MiniTetris from "../MiniTetris";

export default function PlayScreen({
  selectedGame,
  selectedDifficulty,
  onFinish,
  onBack,
}) {
  const renderGame = () => {
    if (selectedGame?.id === "code-firewall") {
      return (
        <CodeFirewall
          difficulty={selectedDifficulty}
          onFinish={onFinish}
        />
      );
    }

    if (selectedGame?.id === "concept-sorter") {
      return (
        <KnowledgeDefense
          difficulty={selectedDifficulty}
          onFinish={onFinish}
        />
      );
    }

    if (selectedGame?.id === "mini-pacman") {
      return (
        <MiniPacman
          difficulty={selectedDifficulty}
          onFinish={onFinish}
        />
      );
    }

    if (selectedGame?.id === "memory-matrix") {
      return (
        <MiniTetris
          difficulty={selectedDifficulty}
          onFinish={onFinish}
        />
      );
    }

    return (
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        Game not found: {selectedGame?.id}
      </div>
    );
  };

  return (
    <div className={styles.playScreen}>
      <div className={styles.playHeader}>
        <button
          className={styles.backGameBtn}
          onClick={onBack}
        >
          ← Back to Select
        </button>

        <div>
          <p>SELECTED GAME</p>

          <h1>
            {selectedGame?.title}
          </h1>
        </div>
      </div>

      {renderGame()}
    </div>
  );
}