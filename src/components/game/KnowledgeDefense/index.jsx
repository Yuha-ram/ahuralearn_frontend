import { useEffect, useMemo, useState } from "react";

import styles from "./KnowledgeDefense.module.css";

import {
  getKnowledgeDefenseQuestions,
  getKnowledgeDefenseConfig,
} from "../../../api/game/game";

export default function KnowledgeDefense({
  onFinish,
  difficulty = "Easy",
}) {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficultyConfig, setDifficultyConfig] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState(100);

  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(45);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchGameData = async () => {
      const [questionData, configData] =
        await Promise.all([
          getKnowledgeDefenseQuestions(),
          getKnowledgeDefenseConfig(),
        ]);

      setQuestions(questionData);
      setCategories(configData.categories);
      setDifficultyConfig(configData.difficultyConfig);

      const selectedConfig =
        configData.difficultyConfig[difficulty] ||
        configData.difficultyConfig.Easy;

      setTime(selectedConfig.time);
      setLoading(false);
    };

    fetchGameData();
  }, [difficulty]);

  const config = useMemo(() => {
    if (!difficultyConfig) {
      return null;
    }

    return (
      difficultyConfig[difficulty] ||
      difficultyConfig.Easy
    );
  }, [difficultyConfig, difficulty]);

  const currentQuestion = useMemo(() => {
    if (questions.length === 0) {
      return null;
    }

    return questions[currentIndex % questions.length];
  }, [questions, currentIndex]);

  const finishGame = (
    finalScore = score,
    finalMistakes = mistakes
  ) => {
    onFinish({
      score: finalScore,
      accuracy: Math.max(0, 100 - finalMistakes * 20),
      rank:
        finalScore >= 1200
          ? "A+"
          : finalScore >= 800
          ? "A"
          : finalScore >= 400
          ? "B"
          : "C",
    });
  };

  const nextConcept = () => {
    setCurrentIndex((prev) => prev + 1);
    setPosition(100);
  };

  const handleWrong = () => {
    if (!config) {
      return;
    }

    const nextMistakes = mistakes + 1;
    const nextScore = Math.max(0, score - config.penalty);

    setCombo(0);
    setMistakes(nextMistakes);
    setScore(nextScore);
    setFeedback(`Wrong -${config.penalty}`);

    if (nextMistakes >= config.maxMistakes) {
      finishGame(nextScore, nextMistakes);
      return;
    }

    setTimeout(() => {
      setFeedback("");
      nextConcept();
    }, 700);
  };

  const handleCategory = (category) => {
    if (!currentQuestion || !config) {
      return;
    }

    if (category === currentQuestion.correctCategory) {
      const nextCombo = combo + 1;
      const gainedScore = config.baseScore * nextCombo;

      setCombo(nextCombo);
      setScore((prev) => prev + gainedScore);
      setFeedback(`Defense Success +${gainedScore}`);

      setTimeout(() => {
        setFeedback("");
        nextConcept();
      }, 700);
    } else {
      handleWrong();
    }
  };

  useEffect(() => {
    if (loading || !currentQuestion || !config) {
      return;
    }

    const moveTimer = setInterval(() => {
      setPosition((prev) => {
        if (prev <= 8) {
          handleWrong();
          return 100;
        }

        return prev - config.speed;
      });
    }, 500);

    return () => clearInterval(moveTimer);
  }, [
    loading,
    currentQuestion,
    config,
    mistakes,
    score,
  ]);

  useEffect(() => {
    if (loading || !config) {
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, config, score, mistakes]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const index = Number(e.key) - 1;

      if (index >= 0 && index < categories.length) {
        handleCategory(categories[index]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (
    loading ||
    !config ||
    questions.length === 0 ||
    categories.length === 0 ||
    !currentQuestion
  ) {
    return (
      <div className={styles.knowledgeDefense}>
        <div className={styles.defenseArena}>
          Loading knowledge defense data...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.knowledgeDefense}>
      <div className={styles.defenseHeader}>
        <span>KNOWLEDGE DEFENSE</span>

        <div className={styles.defenseStats}>
          <strong>Difficulty: {difficulty}</strong>
          <strong>Score: {score}</strong>
          <strong>Combo: x{combo}</strong>
          <strong>
            Mistakes: {mistakes}/{config.maxMistakes}
          </strong>
          <strong>Time: {time}s</strong>
        </div>
      </div>

      <div className={styles.defenseArena}>
        <div className={styles.baseZone}>
          <span>Knowledge Base</span>
        </div>

        <div
          className={styles.enemyConcept}
          style={{
            left: `${position}%`,
          }}
        >
          {currentQuestion.concept}
        </div>

        <div className={styles.defenseLine}></div>

        {feedback && (
          <div
            className={
              feedback.startsWith("Defense")
                ? styles.correctFeedback
                : styles.wrongFeedback
            }
          >
            {feedback}
          </div>
        )}
      </div>

      <div className={styles.categoryGrid}>
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => handleCategory(category)}
          >
            <span>{index + 1}</span>
            {category}
          </button>
        ))}
      </div>

      <div className={styles.defenseLegend}>
        <span>
          Press 1–{categories.length} or click the correct category before the concept reaches the base.
        </span>
      </div>
    </div>
  );
}