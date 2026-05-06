import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, Home, Timer } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/axios";
import { useSound } from "@/hooks/useSound";

interface GameOption {
  id: string;
  name: string;
}

interface GameRound {
  roundIndex: number;
  correctEmotionId: string;
  correctEmotionName: string;
  iconUrl: string;
  options: GameOption[];
}

interface GameData {
  totalRounds: number;
  rounds: GameRound[];
}

const emotionEmojis: Record<string, string> = {
  "Vui vẻ": "😊",
  "Buồn bã": "😢",
  "Giận dữ": "😠",
  "Ngạc nhiên": "😲",
  "Sợ hãi": "😨",
  "Ghê tởm": "🤢",
  "Bình tĩnh": "😌",
};

const answerColors = [
  { bg: "bg-[#f2df79]", border: "border-[#d4c04c]", text: "text-[#4e3d00]", hover: "hover:bg-[#e9d45a]" },
  { bg: "bg-[#90a7da]", border: "border-[#6c84b9]", text: "text-white", hover: "hover:bg-[#7b95cf]" },
  { bg: "bg-[#9cf4d3]", border: "border-[#006c53]", text: "text-[#006c53]", hover: "hover:bg-[#7be8c0]" },
  { bg: "bg-[#b48fd3]", border: "border-[#8e68ae]", text: "text-white", hover: "hover:bg-[#a37ac6]" },
];

const EmotionGame = () => {
  const navigate = useNavigate();
  const { playCorrect, playWrong, playComplete } = useSound();

  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; correctName?: string } | null>(null);
  const [gameStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer
  useEffect(() => {
    if (showResult || !gameData) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStartTime, showResult, gameData]);

  // Fetch game data
  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const res = await api.get("/game/emotion-match?count=10");
        setGameData(res.data);
        setLoading(false);
        toast.success("Trò chơi sẵn sàng! 🎮");
      } catch (err) {
        console.error(err);
        toast.error("Không tải được trò chơi");
        setLoading(false);
      }
    };
    fetchGame();
  }, []);

  const handleAnswer = (optionId: string) => {
    if (!gameData || feedback?.show) return;

    const round = gameData.rounds[currentRound];
    const isCorrect = optionId === round.correctEmotionId;

    if (isCorrect) {
      setScore((s) => s + 1);
      playCorrect();
    } else {
      playWrong();
    }

    setFeedback({
      show: true,
      correct: isCorrect,
      correctName: round.correctEmotionName,
    });

    setTimeout(() => {
      setFeedback(null);
      if (currentRound >= gameData.rounds.length - 1) {
        // Game over
        setShowResult(true);
        playComplete();
        submitResults(isCorrect ? score + 1 : score);
      } else {
        setCurrentRound((r) => r + 1);
      }
    }, 1500);
  };

  const submitResults = async (finalScore: number) => {
    try {
      await api.post("/game/submit", {
        correctCount: finalScore,
        totalRounds: gameData?.totalRounds || 10,
        timeSpentSeconds: Math.floor((Date.now() - gameStartTime) / 1000),
      });
    } catch (err) {
      console.error("Failed to submit game results:", err);
    }
  };

  const restartGame = () => {
    setCurrentRound(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
    setLoading(true);
    // Fetch new game
    api.get("/game/emotion-match?count=10").then((res) => {
      setGameData(res.data);
      setLoading(false);
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center app-bg gap-4">
        <div className="text-5xl animate-bounce">🎮</div>
        <p className="text-xl font-bold text-[#2c3152]">Đang tải trò chơi...</p>
      </div>
    );
  }

  // Result screen
  if (showResult && gameData) {
    const total = gameData.totalRounds;
    const percentage = Math.round((score / total) * 100);
    const isExcellent = percentage >= 80;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 app-bg">
        <Card className="max-w-lg w-full p-10 text-center rounded-3xl bg-white/90 shadow-xl border-2 border-white/60 animate-scale-in">
          <div className="text-7xl mb-6 animate-bounce">
            {isExcellent ? "🏆" : "🌟"}
          </div>
          <h1 className="text-4xl font-heading font-extrabold mb-4 text-[#2c3152]">
            {isExcellent ? "Xuất sắc!" : "Hoàn thành!"}
          </h1>
          <p className="text-2xl mb-2 text-[#64748b]">Bạn đã trả lời đúng</p>
          <p className="text-5xl font-heading font-extrabold text-[#5e4caf] mb-2">
            {score}/{total}
          </p>
          <p className="text-lg text-[#64748b] mb-2">({percentage}% chính xác)</p>
          <p className="text-lg text-[#64748b] mb-8">
            <Timer className="inline w-5 h-5 mr-1" />
            Thời gian: {formatTime(elapsedSeconds)}
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              onClick={restartGame}
              className="rounded-2xl font-extrabold bg-[#5e4caf] text-white px-6 py-5 h-auto shadow-md"
            >
              <RotateCcw className="mr-2 w-5 h-5" /> Chơi lại
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/practice")}
              className="rounded-2xl font-bold border-2 px-6 py-5 h-auto"
            >
              <ArrowLeft className="mr-2 w-5 h-5" /> Quay lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!gameData) return null;

  const round = gameData.rounds[currentRound];
  const totalQ = gameData.totalRounds;
  const progressPercent = ((currentRound + 1) / totalQ) * 100;
  const emoji = emotionEmojis[round.correctEmotionName] || "🤔";

  return (
    <div className="min-h-screen app-bg flex flex-col font-body overflow-hidden relative">
      {/* Feedback overlay */}
      {feedback?.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-scale-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-sm w-full mx-4 border-4 border-white">
            <div className="text-6xl mb-4">
              {feedback.correct ? "🎉" : "💪"}
            </div>
            <h2 className="text-3xl font-heading font-extrabold mb-3 text-[#5b4f9f]">
              {feedback.correct ? "Chính xác!" : "Thử lại nhé!"}
            </h2>
            {!feedback.correct && (
              <p className="text-xl text-[#64748b] font-bold">
                Đáp án đúng là:<br />
                <span className="text-[#5e4caf] text-2xl mt-2 block">
                  {emotionEmojis[feedback.correctName || ""] || ""} {feedback.correctName}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="w-full p-6 flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate("/practice")}
          className="bg-[#ebe6ef] text-[#484552] p-4 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <div className="flex-1 max-w-md mx-4">
          <div className="flex justify-between text-sm font-heading font-extrabold text-[#5e4caf] mb-2">
            <span>Câu {currentRound + 1}/{totalQ}</span>
            <span className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {formatTime(elapsedSeconds)}
            </span>
          </div>
          <div className="h-4 bg-[#e6e1ea] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#5e4caf] to-[#7b6cc7] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-[#ffe08a] text-[#745b00] px-5 py-2 rounded-xl font-heading font-extrabold text-lg shadow-md border-b-4 border-[#e9c34d]">
          ⭐ {score}
        </div>
      </header>

      {/* Main: Emoji display */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-4">
        <div className="relative mb-6">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-white rounded-full flex items-center justify-center shadow-xl border-8 border-[#e6e1ea] clay-card">
            {round.iconUrl ? (
              <img
                src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${round.iconUrl}`}
                alt="Emotion"
                className="w-32 h-32 md:w-44 md:h-44 object-contain"
                onError={(e) => {
                  // Fallback to emoji if image fails
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.querySelector(".emoji-fallback")?.classList.remove("hidden");
                }}
              />
            ) : null}
            <span className={`emoji-fallback text-8xl md:text-9xl ${round.iconUrl ? "hidden" : ""}`}>
              {emoji}
            </span>
          </div>
        </div>

        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-[#2c3152] mb-2 text-center">
          Cảm xúc này là gì?
        </h2>
        <p className="font-body text-lg text-[#64748b] mb-8">Chọn đáp án đúng nhé!</p>
      </main>

      {/* Answer grid */}
      <footer className="w-full p-6 pb-10">
        <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
          {round.options.map((option, index) => {
            const style = answerColors[index % answerColors.length];
            const optEmoji = emotionEmojis[option.name] || "🤔";
            return (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={!!feedback?.show}
                className={`h-28 md:h-36 rounded-2xl flex flex-col items-center justify-center gap-2 group
                  ${style.bg} border-b-[10px] ${style.border}
                  active:border-b-[4px] active:translate-y-1 transition-all duration-150
                  ${style.hover}
                  disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <span className="text-3xl md:text-4xl">{optEmoji}</span>
                <span className={`font-heading text-xl md:text-2xl font-extrabold ${style.text}`}>
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};

export default EmotionGame;
