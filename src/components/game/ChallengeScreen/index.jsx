import { useEffect, useState } from "react";

import { getChallengeQuestions } from "../../../api/game/game";

import styles from "./ChallengeScreen.module.css";

export default function ChallengeScreen({
  courseId,
  selectedGame,
  onFinish,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedGame?.id) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const questionList = await getChallengeQuestions(
        courseId,
        selectedGame.id
      );

      setQuestions(questionList);
      setCurrentIndex(0);
      setSelectedAnswer("");
      setShowResult(false);
      setAnswers([]);

      setLoading(false);
    };

    fetchQuestions();
  }, [courseId, selectedGame]);

  const currentQuestion = questions[currentIndex];

  if (loading) {
    return (
      <div className={styles.challengeScreen}>
        <div className={styles.challengeCard}>
          <h1>Loading Questions...</h1>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className={styles.challengeScreen}>
        <div className={styles.challengeCard}>
          <h1>No Questions Found</h1>

          <button
            className={styles.submitBtn}
            onClick={() =>
              onFinish({
                quizScore: 0,
                correctAnswers: 0,
                totalQuestions: 0,
              })
            }
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (option) => {
    const isCorrect =
      option === currentQuestion.answer;

    setSelectedAnswer(option);
    setShowResult(true);

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswer: option,
        correct: isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    const isLastQuestion =
      currentIndex === questions.length - 1;

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setShowResult(false);
      return;
    }

    const correctAnswers = answers.filter(
      (item) => item.correct
    ).length;

    onFinish({
      quizScore: correctAnswers * 100,
      correctAnswers,
      totalQuestions: questions.length,
    });
  };

  return (
    <div className={styles.challengeScreen}>
      <div className={styles.challengeCard}>
        <p className={styles.challengeLabel}>
          POST GAME CHALLENGE
        </p>

        <h1>{selectedGame?.title}</h1>

        <p className={styles.questionProgress}>
          Question {currentIndex + 1} / {questions.length}
        </p>

        <p className={styles.challengeQuestion}>
          {currentQuestion.question}
        </p>

        <div className={styles.challengeOptions}>
          {currentQuestion.options.map((option) => {
            const optionClass = showResult
              ? option === currentQuestion.answer
                ? styles.correct
                : option === selectedAnswer
                ? styles.wrong
                : ""
              : "";

            return (
              <button
                key={option}
                className={optionClass}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={styles.explanationBox}>
            <strong>
              {selectedAnswer === currentQuestion.answer
                ? "+100 Correct!"
                : "Incorrect"}
            </strong>

            <p>{currentQuestion.explanation}</p>

            <button
              className={styles.submitBtn}
              onClick={handleNext}
            >
              {currentIndex < questions.length - 1
                ? "Next Question →"
                : "View Result →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}