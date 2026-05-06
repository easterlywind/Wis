import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Trophy, RotateCcw, Volume2, Timer } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/axios";
import { useSound } from "@/hooks/useSound";
import { useSpeech } from "@/hooks/useSpeech";

interface StoryOption {
  id: string;
  name: string;
}

interface StoryRound {
  roundIndex: number;
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  explanation: string | null;
  correctEmotionId: string;
  correctEmotionName: string;
  options: StoryOption[];
}

interface StoryData {
  totalRounds: number;
  rounds: StoryRound[];
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

const StoryMode = () => {
  const navigate = useNavigate();
  const { playCorrect, playWrong, playComplete } = useSound();
  const { speak, stop, autoSpeak } = useSpeech();

  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; correctName?: string; explanation?: string | null } | null>(null);
  const [gameStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timer
  useEffect(() => {
    if (showResult || !storyData) return;
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStartTime, showResult, storyData]);

  // Fetch story data
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const res = await api.get("/stories/random?count=5");
        setStoryData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được câu chuyện");
        setLoading(false);
      }
    };
    fetchStories();
    
    return () => stop();
  }, [stop]);

  // Read aloud when new round loads
  useEffect(() => {
    if (storyData && !showResult && !feedback?.show) {
      const round = storyData.rounds[currentRound];
      const textToRead = `${round.title}. ${round.content}`;
      autoSpeak(textToRead);
    }
  }, [storyData, currentRound, showResult, feedback?.show, autoSpeak]);

  const readStory = () => {
    if (!storyData) return;
    const round = storyData.rounds[currentRound];
    const textToRead = `${round.title}. ${round.content}`;
    speak(textToRead);
  };

  const handleAnswer = (optionId: string) => {
    if (!storyData || feedback?.show) return;

    stop(); // stop reading if currently speaking

    const round = storyData.rounds[currentRound];
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
      explanation: round.explanation,
    });
    
    // Automatically read explanation if correct
    if (isCorrect && round.explanation) {
      speak(`Chính xác! ${round.explanation}`);
    } else if (!isCorrect) {
      speak(`Đáp án đúng là ${round.correctEmotionName}.`);
    }
  };

  const nextRound = () => {
    setFeedback(null);
    stop();
    if (currentRound >= (storyData?.rounds.length || 0) - 1) {
      // Game over
      setShowResult(true);
      playComplete();
      submitResults(score); // Score already updated in handleAnswer via setScore but it might be asynchronous, wait, handleAnswer uses setScore(s => s + 1), but we pass score which is old.
      // Better to calculate final score here
    } else {
      setCurrentRound((r) => r + 1);
    }
  };

  // Safe wrapper for submitting result since state score might be delayed
  const handleAnswerWithSubmit = (optionId: string) => {
    if (!storyData || feedback?.show) return;

    stop(); // stop reading if currently speaking

    const round = storyData.rounds[currentRound];
    const isCorrect = optionId === round.correctEmotionId;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
      playCorrect();
    } else {
      playWrong();
    }

    setFeedback({
      show: true,
      correct: isCorrect,
      correctName: round.correctEmotionName,
      explanation: round.explanation,
    });
    
    if (isCorrect && round.explanation) {
      speak(`Chính xác! ${round.explanation}`);
    } else if (!isCorrect) {
      speak(`Chưa đúng rồi. Đáp án đúng là ${round.correctEmotionName}.`);
    }

    // Delay next round if we want to show feedback, instead of setTimeout let's use a "Tiếp tục" button
  };

  const proceedNextRound = () => {
    setFeedback(null);
    stop();
    if (currentRound >= (storyData?.rounds.length || 0) - 1) {
      setShowResult(true);
      playComplete();
      submitResults(score); 
    } else {
      setCurrentRound((r) => r + 1);
    }
  };


  const submitResults = async (finalScore: number) => {
    try {
      await api.post("/stories/submit", {
        correctCount: finalScore,
        totalRounds: storyData?.totalRounds || 5,
        timeSpentSeconds: Math.floor((Date.now() - gameStartTime) / 1000),
      });
    } catch (err) {
      console.error("Failed to submit story results:", err);
    }
  };

  const restartGame = () => {
    setCurrentRound(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
    setLoading(true);
    stop();
    
    api.get("/stories/random?count=5").then((res) => {
      setStoryData(res.data);
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
        <div className="text-5xl animate-bounce">📚</div>
        <p className="text-xl font-bold text-[#2c3152]">Đang tải câu chuyện...</p>
      </div>
    );
  }

  // Result screen
  if (showResult && storyData) {
    const total = storyData.totalRounds;
    const percentage = Math.round((score / total) * 100);
    const isExcellent = percentage >= 80;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 app-bg">
        <Card className="max-w-lg w-full p-10 text-center rounded-3xl bg-white/90 shadow-xl border-2 border-white/60 animate-scale-in">
          <div className="text-7xl mb-6 animate-bounce">
            {isExcellent ? "🏆" : "🌟"}
          </div>
          <h1 className="text-4xl font-heading font-extrabold mb-4 text-[#2c3152]">
            {isExcellent ? "Tuyệt vời!" : "Hoàn thành!"}
          </h1>
          <p className="text-2xl mb-2 text-[#64748b]">Bạn đã nhận diện đúng</p>
          <p className="text-5xl font-heading font-extrabold text-[#745b00] mb-2">
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
              className="rounded-2xl font-extrabold bg-[#745b00] text-white px-6 py-5 h-auto shadow-md hover:bg-[#5a4600]"
            >
              <RotateCcw className="mr-2 w-5 h-5" /> Nghe chuyện khác
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => { stop(); navigate("/practice"); }}
              className="rounded-2xl font-bold border-2 px-6 py-5 h-auto"
            >
              <ArrowLeft className="mr-2 w-5 h-5" /> Quay lại
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!storyData || storyData.rounds.length === 0) return (
    <div className="min-h-screen flex items-center justify-center p-4 app-bg">
      <div className="text-center">
        <p className="text-xl mb-4 text-[#64748b] font-bold">Chưa có câu chuyện nào trong hệ thống.</p>
        <Button onClick={() => navigate("/practice")}>Quay lại</Button>
      </div>
    </div>
  );

  const round = storyData.rounds[currentRound];
  const totalQ = storyData.totalRounds;
  const progressPercent = ((currentRound + 1) / totalQ) * 100;

  return (
    <div className="min-h-screen app-bg flex flex-col font-body overflow-hidden relative">
      {/* Feedback overlay */}
      {feedback?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-scale-in p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-lg w-full border-4 border-white flex flex-col items-center">
            <div className="text-6xl mb-4">
              {feedback.correct ? "🎉" : "💪"}
            </div>
            <h2 className="text-3xl font-heading font-extrabold mb-4 text-center text-[#2c3152]">
              {feedback.correct ? "Chính xác!" : "Thử lại nhé!"}
            </h2>
            
            <div className="bg-[#f8f9fa] rounded-2xl p-6 mb-6 w-full text-center">
              <p className="text-xl font-bold text-[#64748b] mb-2">Đáp án đúng là:</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl">{emotionEmojis[feedback.correctName || ""] || "🤔"}</span>
                <span className="text-2xl font-heading font-extrabold text-[#745b00]">
                  {feedback.correctName}
                </span>
              </div>
              
              {feedback.explanation && (
                <p className="text-[#484552] text-lg mt-4 leading-relaxed font-medium">
                  {feedback.explanation}
                </p>
              )}
            </div>

            <Button
              onClick={proceedNextRound}
              className="w-full rounded-2xl font-heading font-extrabold text-xl py-6 bg-[#745b00] hover:bg-[#5a4600] text-white shadow-lg"
            >
              Tiếp tục
            </Button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="w-full p-6 flex items-center gap-4 shrink-0">
        <button
          onClick={() => { stop(); navigate("/practice"); }}
          className="bg-[#ebe6ef] text-[#484552] p-4 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>

        <div className="flex-1 max-w-md mx-4">
          <div className="flex justify-between text-sm font-heading font-extrabold text-[#745b00] mb-2">
            <span>Câu chuyện {currentRound + 1}/{totalQ}</span>
            <span className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {formatTime(elapsedSeconds)}
            </span>
          </div>
          <div className="h-4 bg-[#e6e1ea] rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#ffe08a] to-[#eeb020] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-[#ffe08a] text-[#745b00] px-5 py-2 rounded-xl font-heading font-extrabold text-lg shadow-md border-b-4 border-[#e9c34d]">
          ⭐ {score}
        </div>
      </header>

      {/* Main Content: Story reading */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 overflow-y-auto pb-4">
        <Card className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl border-4 border-white clay-card mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Story text */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-[#745b00]">
                  {round.title}
                </h2>
                <Button 
                  onClick={readStory}
                  variant="outline"
                  className="rounded-full bg-[#fdfaf1] border-2 border-[#ffe08a] text-[#745b00] hover:bg-[#ffe08a]"
                  size="icon"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="bg-[#fdfaf1] p-6 rounded-3xl border-2 border-[#f2df79]/30">
                <p className="text-xl md:text-2xl text-[#2c3152] leading-relaxed font-body font-medium">
                  {round.content}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <h3 className="font-heading text-xl md:text-2xl font-extrabold text-[#2c3152] mb-6 text-center bg-white/50 px-6 py-2 rounded-full inline-block">
          Nhân vật trong truyện đang cảm thấy thế nào?
        </h3>

        {/* Answer grid */}
        <div className="grid grid-cols-2 gap-4 max-w-3xl w-full mx-auto pb-10">
          {round.options.map((option, index) => {
            const style = answerColors[index % answerColors.length];
            const optEmoji = emotionEmojis[option.name] || "🤔";
            return (
              <button
                key={option.id}
                onClick={() => handleAnswerWithSubmit(option.id)}
                disabled={!!feedback?.show}
                className={`h-24 md:h-32 rounded-2xl flex flex-row items-center justify-center gap-4 group
                  ${style.bg} border-b-[8px] ${style.border}
                  active:border-b-[4px] active:translate-y-1 transition-all duration-150
                  ${style.hover} px-4
                  disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <span className="text-4xl">{optEmoji}</span>
                <span className={`font-heading text-xl md:text-2xl font-extrabold ${style.text}`}>
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default StoryMode;
