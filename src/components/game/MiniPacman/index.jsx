import { useEffect, useRef, useState } from "react";

import styles from "./MiniPacman.module.css";

const gridSize = 10;

const difficultyConfig = {
  Easy: {
    time: 60,
    enemyCount: 1,
    enemySpeed: 900,
  },

  Medium: {
    time: 45,
    enemyCount: 2,
    enemySpeed: 700,
  },

  Hard: {
    time: 30,
    enemyCount: 3,
    enemySpeed: 500,
  },
};

function createFood(count = 8) {
  return Array.from({ length: count }).map(() => ({
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  }));
}

function createEnemies(count) {
  return Array.from({ length: count }).map(() => ({
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  }));
}

export default function MiniPacman({
  onFinish,
  difficulty = "Easy",
}) {
  const config =
    difficultyConfig[difficulty] || difficultyConfig.Easy;

  const lastMoveTimeRef = useRef(0);

  const [player, setPlayer] = useState({
    x: 0,
    y: 0,
  });

  const [foods, setFoods] = useState(() =>
    createFood(8)
  );

  const [enemies, setEnemies] = useState(() =>
    createEnemies(config.enemyCount)
  );

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(config.time);

  const playerRef = useRef(player);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const finishGame = (finalScore = score) => {
    onFinish({
      score: finalScore,
      accuracy: finalScore >= 500 ? 80 : 60,
      rank:
        finalScore >= 1000
          ? "A+"
          : finalScore >= 500
          ? "A"
          : "C",
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame(score);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const now = Date.now();

      if (now - lastMoveTimeRef.current < 150) {
        return;
      }

      lastMoveTimeRef.current = now;

      setPlayer((prev) => {
        let nextX = prev.x;
        let nextY = prev.y;

        if (e.key === "ArrowUp" || e.key === "w") {
          nextY -= 1;
        }

        if (e.key === "ArrowDown" || e.key === "s") {
          nextY += 1;
        }

        if (e.key === "ArrowLeft" || e.key === "a") {
          nextX -= 1;
        }

        if (e.key === "ArrowRight" || e.key === "d") {
          nextX += 1;
        }

        return {
          x: Math.max(0, Math.min(gridSize - 1, nextX)),
          y: Math.max(0, Math.min(gridSize - 1, nextY)),
        };
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const enemyTimer = setInterval(() => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          const currentPlayer = playerRef.current;

          let nextX = enemy.x;
          let nextY = enemy.y;

          const moveX = Math.abs(
            currentPlayer.x - enemy.x
          );

          const moveY = Math.abs(
            currentPlayer.y - enemy.y
          );

          if (moveX > moveY) {
            nextX += currentPlayer.x > enemy.x ? 1 : -1;
          } else if (moveY > 0) {
            nextY += currentPlayer.y > enemy.y ? 1 : -1;
          }

          return {
            x: Math.max(0, Math.min(gridSize - 1, nextX)),
            y: Math.max(0, Math.min(gridSize - 1, nextY)),
          };
        })
      );
    }, config.enemySpeed);

    return () => clearInterval(enemyTimer);
  }, [config.enemySpeed]);

  useEffect(() => {
    const hitFood = foods.find(
      (food) =>
        food.x === player.x &&
        food.y === player.y
    );

    if (hitFood) {
      setFoods((prev) => {
        const remainingFoods = prev.filter(
          (food) =>
            !(
              food.x === player.x &&
              food.y === player.y
            )
        );

        return [
          ...remainingFoods,
          {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          },
        ];
      });

      setScore((prev) => prev + 100);
    }
  }, [player, foods]);

  useEffect(() => {
    const hitEnemy = enemies.some(
      (enemy) =>
        enemy.x === player.x &&
        enemy.y === player.y
    );

    if (hitEnemy) {
      finishGame(score);
    }
  }, [player, enemies, score]);

  return (
    <div className={styles.pacmanGame}>
      <div className={styles.pacmanHeader}>
        <span>MINI PACMAN</span>

        <div className={styles.pacmanStats}>
          <strong>Difficulty: {difficulty}</strong>
          <strong>Score: {score}</strong>
          <strong>Enemies: {config.enemyCount}</strong>
          <strong>Time: {time}s</strong>
        </div>
      </div>

      <div className={styles.pacmanBoard}>
        <div
          className={styles.pacmanPlayer}
          style={{
            left: `${player.x * 10 + 5}%`,
            top: `${player.y * 10 + 5}%`,
          }}
        ></div>

        {foods.map((food, index) => (
          <div
            key={index}
            className={styles.pacmanFood}
            style={{
              left: `${food.x * 10 + 5}%`,
              top: `${food.y * 10 + 5}%`,
            }}
          ></div>
        ))}

        {enemies.map((enemy, index) => (
          <div
            key={index}
            className={styles.pacmanEnemy}
            style={{
              left: `${enemy.x * 10 + 5}%`,
              top: `${enemy.y * 10 + 5}%`,
            }}
          ></div>
        ))}
      </div>

      <p className={styles.pacmanTip}>
        Use WASD or Arrow Keys. Higher difficulty adds more enemies and shorter time.
      </p>
    </div>
  );
}