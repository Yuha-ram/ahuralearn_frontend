import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import StartScreen from "../../components/game/StartScreen";
import GameSelectScreen from "../../components/game/GameSelectScreen";
import InstructionScreen from "../../components/game/InstructionScreen";
import PlayScreen from "../../components/game/PlayScreen";
import ChallengeScreen from "../../components/game/ChallengeScreen";
import ResultScreen from "../../components/game/ResultScreen";

import { submitGameResult } from "../../api/game/game";

import "./Game.module.css";

export default function Game() {
  const [searchParams] = useSearchParams();

  const courseId =
    Number(searchParams.get("courseId")) || 1;

  const [screen, setScreen] = useState("start");
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState("Easy");
  const [gameResult, setGameResult] = useState(null);

  const handleStart = (difficulty) => {
    setSelectedDifficulty(difficulty || "Easy");
    setSelectedGame(null);
    setGameResult(null);
    setScreen("select");
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setGameResult(null);
    setScreen("instruction");
  };

  return (
    <>
      {screen === "start" && (
        <StartScreen onStart={handleStart} />
      )}

      {screen === "select" && (
        <GameSelectScreen
          courseId={courseId}
          onSelectGame={handleSelectGame}
          onBack={() => setScreen("start")}
        />
      )}

      {screen === "instruction" && selectedGame && (
        <InstructionScreen
          courseId={courseId}
          selectedGame={selectedGame}
          selectedDifficulty={selectedDifficulty}
          onStart={() => setScreen("play")}
          onBack={() => setScreen("select")}
        />
      )}

      {screen === "play" && selectedGame && (
        <PlayScreen
          courseId={courseId}
          selectedGame={selectedGame}
          selectedDifficulty={selectedDifficulty}
          onBack={() => setScreen("select")}
          onFinish={(result) => {
            setGameResult(result);
            setScreen("challenge");
          }}
        />
      )}

      {screen === "challenge" && selectedGame && (
        <ChallengeScreen
          courseId={courseId}
          selectedGame={selectedGame}
          onFinish={async (challengeResult) => {
            const finalResult = {
              courseId,
              gameId: selectedGame.id,
              gameTitle: selectedGame.title,
              difficulty: selectedDifficulty,
              score: gameResult?.score ?? 0,
              accuracy: gameResult?.accuracy ?? 0,
              rank: gameResult?.rank ?? "C",
              quizScore: challengeResult.quizScore,
              correctAnswers: challengeResult.correctAnswers,
              totalQuestions: challengeResult.totalQuestions,
              finalScore:
                (gameResult?.score ?? 0) +
                challengeResult.quizScore,
            };

            setGameResult(finalResult);

            await submitGameResult(finalResult);

            setScreen("result");
          }}
        />
      )}

      {screen === "result" && selectedGame && (
        <ResultScreen
          courseId={courseId}
          selectedGame={selectedGame}
          result={gameResult}
          onRestart={() => setScreen("play")}
          onBackToMenu={() => setScreen("start")}
        />
      )}
    </>
  );
}