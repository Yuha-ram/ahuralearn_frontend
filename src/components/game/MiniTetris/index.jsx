import { useEffect, useState } from "react";

import styles from "./MiniTetris.module.css";

const ROWS = 16;
const COLS = 10;

const shapes = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
];

const difficultyConfig = {
  Easy: {
    dropSpeed: 700,
  },
  Medium: {
    dropSpeed: 500,
  },
  Hard: {
    dropSpeed: 300,
  },
};

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () =>
    Array(COLS).fill(0)
  );
}

function randomPiece() {
  return {
    shape:
      shapes[
        Math.floor(Math.random() * shapes.length)
      ],
    x: 3,
    y: 0,
  };
}

function rotate(shape) {
  return shape[0].map((_, index) =>
    shape.map((row) => row[index]).reverse()
  );
}

export default function MemoryMatrix({
  onFinish,
  difficulty = "Easy",
}) {
  const config =
    difficultyConfig[difficulty] ||
    difficultyConfig.Easy;

  const [board, setBoard] =
    useState(createEmptyBoard);

  const [piece, setPiece] =
    useState(randomPiece);

  const [nextPiece, setNextPiece] =
    useState(randomPiece);

  const [score, setScore] = useState(0);

  const finishGame = (finalScore = score) => {
    onFinish({
      score: finalScore,
      accuracy: finalScore >= 500 ? 85 : 65,
      rank:
        finalScore >= 1000
          ? "A+"
          : finalScore >= 500
          ? "A"
          : "B",
    });
  };

  const collide = (
    next,
    currentBoard = board
  ) => {
    return next.shape.some((row, y) =>
      row.some((cell, x) => {
        if (!cell) {
          return false;
        }

        const newX = next.x + x;
        const newY = next.y + y;

        return (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          currentBoard[newY]?.[newX]
        );
      })
    );
  };

  const mergePiece = () => {
    const newBoard = board.map((row) => [
      ...row,
    ]);

    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;

          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      });
    });

    let clearedLines = 0;

    for (let y = ROWS - 1; y >= 0; y--) {
      const isFull = newBoard[y].every(
        (cell) => cell === 1
      );

      if (isFull) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(COLS).fill(0));
        clearedLines++;
        y++;
      }
    }

    const nextScore =
      clearedLines > 0
        ? score + clearedLines * 100
        : score;

    if (clearedLines > 0) {
      setScore(nextScore);
    }

    const newPiece = {
      ...nextPiece,
      x: 3,
      y: 0,
    };

    const upcomingPiece = randomPiece();

    if (collide(newPiece, newBoard)) {
      finishGame(nextScore);
    } else {
      setBoard(newBoard);
      setPiece(newPiece);
      setNextPiece(upcomingPiece);
    }
  };

  const movePiece = (dx, dy) => {
    const next = {
      ...piece,
      x: piece.x + dx,
      y: piece.y + dy,
    };

    if (collide(next)) {
      if (dy === 1) {
        mergePiece();
      }

      return;
    }

    setPiece(next);
  };

  const rotatePiece = () => {
    const next = {
      ...piece,
      shape: rotate(piece.shape),
    };

    if (!collide(next)) {
      setPiece(next);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      movePiece(0, 1);
    }, config.dropSpeed);

    return () => clearInterval(timer);
  }, [piece, board, config.dropSpeed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "a"
      ) {
        movePiece(-1, 0);
      }

      if (
        e.key === "ArrowRight" ||
        e.key === "d"
      ) {
        movePiece(1, 0);
      }

      if (
        e.key === "ArrowDown" ||
        e.key === "s"
      ) {
        movePiece(0, 1);
      }

      if (
        e.key === "ArrowUp" ||
        e.key === "w"
      ) {
        rotatePiece();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [piece, board]);

  const displayBoard = board.map((row) => [
    ...row,
  ]);

  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;

        if (
          boardY >= 0 &&
          boardY < ROWS &&
          boardX >= 0 &&
          boardX < COLS
        ) {
          displayBoard[boardY][boardX] = 2;
        }
      }
    });
  });

  return (
    <div className={styles.tetrisGame}>
      <div className={styles.tetrisHeader}>
        <span>MINI TETRIS</span>

        <strong>
          Difficulty: {difficulty}
        </strong>

        <strong>
          Speed: {config.dropSpeed}ms
        </strong>

        <strong>
          Score: {score}
        </strong>
      </div>

      <div className={styles.tetrisLayout}>
        <div className={styles.tetrisBoard}>
          {displayBoard.flatMap((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`${styles.tetrisCell} ${
                  cell === 1
                    ? styles.fixed
                    : cell === 2
                    ? styles.active
                    : ""
                }`}
              ></div>
            ))
          )}
        </div>

        <div className={styles.nextPanel}>
          <h3>NEXT</h3>

          <div className={styles.nextGrid}>
            {Array.from({
              length: 16,
            }).map((_, index) => {
              const row = Math.floor(index / 4);
              const col = index % 4;

              const filled =
                nextPiece.shape[row]?.[col] === 1;

              return (
                <div
                  key={index}
                  className={`${styles.nextCell} ${
                    filled ? styles.filled : ""
                  }`}
                ></div>
              );
            })}
          </div>

          <p>
            ↑ Rotate
            <br />
            ↓ Drop
          </p>
        </div>
      </div>

      <p className={styles.tetrisTip}>
        Use ← → to move, ↓ to drop, ↑ to rotate. Higher difficulty makes blocks fall faster.
      </p>
    </div>
  );
}