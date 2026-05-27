import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { Volume2, X, Sparkles, PartyPopper, Smile, Frown, Angry, Meh } from "lucide-react";
import { toast } from "sonner";
import { Quiz } from "@/types/quiz";
import { AnswerChoice } from "@/types/question";
import { getEmotionEmoji } from "@/types/emotion";
import { api } from "../lib/axios";
import { getDataWithRetry } from "@/lib/apiRetry";
import { detectMediaType, type MediaType } from "@/lib/utils";
import { useSpeech } from "@/hooks/useSpeech";
import { useSound } from "@/hooks/useSound";
import mascot from "@/assets/mascot.png";

interface QuizLocationState {
  quizId?: string;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as QuizLocationState;
  const quizId = state?.quizId;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [mediaError, setMediaError] = useState(false);
  const [selectedAnswerState, setSelectedAnswerState] = useState<{
    choice: AnswerChoice;
    isCorrect: boolean;
    correctAnswer: AnswerChoice;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TTS & Sound
  const { speak, autoSpeak } = useSpeech();
  const { playCorrect, playWrong, playComplete } = useSound();

  // Track user answers for submission
  const userAnswersRef = useRef<{ questionId: string; selectedAnswer: AnswerChoice }[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const endpoint = quizId ? `quiz/${quizId}` : "/quiz/random";

    (async () => {
      try {
        const data = await getDataWithRetry<Quiz>(
          () => api.get<Quiz>(endpoint),
          (d) => !!d && Array.isArray((d as any).questions) && (d as any).questions.length > 0,
          { maxAttempts: 6, initialDelayMs: 400 }
        );

        const shuffled: Quiz = {
          ...data,
          questions: [...data.questions].sort(() => Math.random() - 0.5),
        };
        setQuiz(shuffled);
        setLoading(false);
        toast.success("Quiz đã sẵn sàng! Chúc bé chơi vui!");
      } catch (err: any) {
        console.error("Quiz load error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Không tải được quiz";
        setError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
      }
    })();
  }, [quizId]);

  // Detect media type and auto-speak when question changes
  useEffect(() => {
    const currentQuestion = quiz?.questions[currentIdx];
    if (!currentQuestion) return;

    // Auto-read question if setting is enabled
    autoSpeak(currentQuestion.content);

    setMediaError(false);
    if (currentQuestion.mediaUrl) {
      detectMediaType(currentQuestion.mediaUrl).then((type) => {
        setMediaType(type);
      });
    }
  }, [currentIdx, quiz, autoSpeak]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center app-bg gap-4">
        <div className="text-5xl animate-bounce">📝</div>
        <p className="text-xl font-bold text-[#2c3152]">Đang tải quiz...</p>
        <p className="text-[#64748b]">Chờ chút nhé!</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 app-bg">
        <Card className="max-w-md w-full p-8 text-center rounded-3xl bg-white/90 border-2 border-white/60 shadow-lg">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-2xl font-extrabold mb-3 text-[#2c3152]">Không tải được Quiz</h2>
          <p className="text-[#64748b] mb-6">{error || "Quiz không tồn tại"}</p>
          <Button
            onClick={() => navigate("/home")}
            className="rounded-2xl font-bold bg-[#5e4caf] text-white px-6 py-3"
            id="quiz-error-home-btn"
          >
            ← Quay lại Trang chủ
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions?.[currentIdx];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 app-bg">
        <Card className="max-w-md w-full p-8 text-center rounded-3xl bg-white/90 border-2 border-white/60 shadow-lg">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-extrabold mb-3 text-[#2c3152]">Không có câu hỏi</h2>
          <Button
            onClick={() => navigate("/home")}
            className="rounded-2xl font-bold bg-[#5e4caf] text-white"
          >
            ← Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  const handleChoice = (choice: AnswerChoice) => {
    if (!currentQuestion || selectedAnswerState) return;

    const isCorrect = choice === currentQuestion.correctAnswer;

    setSelectedAnswerState({
      choice,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
    });

    if (isCorrect) {
      setScore((s) => s + 1);
      playCorrect();
    } else {
      playWrong();
    }

    // Track answer
    userAnswersRef.current.push({
      questionId: currentQuestion.id,
      selectedAnswer: choice,
    });

    setTimeout(() => {
      setSelectedAnswerState(null);
      if (currentIdx === quiz!.questions.length - 1) {
        setShowResult(true);
        playComplete();
        // Submit results to backend
        submitQuizResults();
      } else {
        setCurrentIdx((i) => i + 1);
      }
    }, 1500);
  };

  const submitQuizResults = async () => {
    if (!quiz) return;
    try {
      await api.post(`/quiz/${quiz.id}/submit`, {
        answers: userAnswersRef.current,
      });
    } catch (err) {
      console.error('Failed to submit quiz results:', err);
    }
  };

  const options = [
    {
      choice: "A" as AnswerChoice,
      text: currentQuestion?.optionA,
      emoji: currentQuestion?.optionA
        ? getEmotionEmoji(currentQuestion.optionA)
        : "",
    },
    {
      choice: "B" as AnswerChoice,
      text: currentQuestion?.optionB,
      emoji: currentQuestion?.optionB
        ? getEmotionEmoji(currentQuestion.optionB)
        : "",
    },
    {
      choice: "C" as AnswerChoice,
      text: currentQuestion?.optionC,
      emoji: currentQuestion?.optionC
        ? getEmotionEmoji(currentQuestion.optionC)
        : "",
    },
    {
      choice: "D" as AnswerChoice,
      text: currentQuestion?.optionD,
      emoji: currentQuestion?.optionD
        ? getEmotionEmoji(currentQuestion.optionD)
        : "",
    },
  ].filter(
    (opt): opt is { choice: AnswerChoice; text: string; emoji: string } =>
      !!opt.text && opt.text.trim() !== ""
  );

  const getFullMediaUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api$/, "");
    return `${baseUrl}/${url.startsWith("/") ? url.slice(1) : url}`;
  };

  const playAudio = () => {
    if (!currentQuestion?.mediaUrl) {
      toast.error("Không có âm thanh để phát");
      return;
    }

    const audio = new Audio(getFullMediaUrl(currentQuestion.mediaUrl));
    audio.play().catch((err) => {
      console.error(err);
      toast.error("Không thể phát âm thanh");
    });

    toast.info("🔊 Đang phát hướng dẫn...");
  };

  if (showResult) {
    const totalQuestions = quiz?.questions?.length ?? 0;
    const percentage = Math.round((score / totalQuestions) * 100);
    const isExcellent = percentage >= 80;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 app-bg">
        <Card className="max-w-lg w-full p-10 text-center rounded-3xl bg-white/90 shadow-xl border-2 border-white/60 animate-scale-in">
          <div className="text-7xl mb-6 animate-bounce">
            {isExcellent ? "🎉" : "🌟"}
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-[#2c3152]">
            {isExcellent ? "Tuyệt vời!" : "Hoàn thành!"}
          </h1>
          <p className="text-2xl mb-2 text-[#64748b]">
            Bạn đã trả lời đúng
          </p>
          <p className="text-5xl font-extrabold text-[#5e4caf] mb-2">
            {score}/{totalQuestions}
          </p>
          <p className="text-lg text-[#64748b] mb-8">
            ({percentage}% chính xác)
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => {
                setCurrentIdx(0);
                setScore(0);
                setShowResult(false);
              }}
              className="rounded-2xl font-extrabold bg-[#5e4caf] text-white px-6 py-5 h-auto shadow-md"
              id="quiz-retry-btn"
            >
              🔄 Làm lại
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/home")}
              className="rounded-2xl font-bold border-2 px-6 py-5 h-auto"
              id="quiz-home-btn"
            >
              🏠 Về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const totalQ = quiz?.questions?.length ?? 1;
  const progressPercent = ((currentIdx + 1) / totalQ) * 100;

  // Custom mapping for button colors based on index or emotion
  const buttonColors = [
    { bg: "bg-[#f2df79]", border: "border-[#d4c04c]", shadow: "shadow-[0_12px_24px_-8px_rgba(212,192,76,0.5)]", text: "text-[#4e3d00]", activeShadow: "active:shadow-[0_4px_12px_-8px_rgba(212,192,76,0.5)]" },
    { bg: "bg-[#90a7da]", border: "border-[#6c84b9]", shadow: "shadow-[0_12px_24px_-8px_rgba(108,132,185,0.5)]", text: "text-white", activeShadow: "active:shadow-[0_4px_12px_-8px_rgba(108,132,185,0.5)]" },
    { bg: "bg-[#e57f7f]", border: "border-[#c25b5b]", shadow: "shadow-[0_12px_24px_-8px_rgba(194,91,91,0.5)]", text: "text-white", activeShadow: "active:shadow-[0_4px_12px_-8px_rgba(194,91,91,0.5)]" },
    { bg: "bg-[#b48fd3]", border: "border-[#8e68ae]", shadow: "shadow-[0_12px_24px_-8px_rgba(142,104,174,0.5)]", text: "text-white", activeShadow: "active:shadow-[0_4px_12px_-8px_rgba(142,104,174,0.5)]" },
  ];

  return (
    <>


      <div className="min-h-screen app-bg flex flex-col font-body overflow-hidden relative">

      {/* ── Top Navigation Area ── */}
      <header className="w-full p-6 flex items-center justify-between z-10">
        <button
          onClick={() => navigate("/home")}
          className="bg-[#ebe6ef] text-[#484552] p-4 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          id="quiz-back-btn"
        >
          <X className="w-8 h-8 stroke-[3]" />
        </button>

        <div className="flex-1 max-w-md mx-8">
          <div className="h-6 w-full bg-[#e6e1ea] rounded-full overflow-hidden border-4 border-[#fdf8ff] shadow-inner">
            <div
              className="h-full bg-[#7765c9] rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="font-heading font-extrabold text-[#5e4caf]">
              {currentIdx + 1} / {totalQ} câu hỏi
            </span>
          </div>
        </div>

        <div className="w-16 h-16 bg-[#ebe6ef] rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img alt="User Profile" className="w-full h-full object-cover" src={mascot} />
        </div>
      </header>

      {/* ── Main Content Area: Character Focus ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-4 text-center overflow-hidden">
        {currentQuestion.mediaUrl ? (
          <>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#5e4caf] mb-8 drop-shadow-sm">
              {currentQuestion.content ?? "Bạn cảm thấy thế nào?"}
            </h1>

            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* Large Focus Image Container */}
              <div className="w-full h-full rounded-xl bg-white border-b-8 border-[#e6e1ea] shadow-2xl p-8 flex flex-col items-center justify-center transform hover:rotate-1 transition-transform cursor-pointer relative" onClick={playAudio}>
                 {!mediaError ? (
                    <>
                      {mediaType === "video" ? (
                        <video
                          src={getFullMediaUrl(currentQuestion.mediaUrl)}
                          controls
                          onError={() => setMediaError(true)}
                          className="max-w-full max-h-full rounded-2xl object-contain"
                        />
                      ) : (
                        <img
                          src={getFullMediaUrl(currentQuestion.mediaUrl)}
                          alt="Emotion Character"
                          onError={() => setMediaError(true)}
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-400 rounded-3xl font-bold">
                      ⚠️ Lỗi ảnh
                    </div>
                  )}
                  {/* Optional Audio Button Overlay */}
                  <div className="absolute bottom-4 right-4 bg-white/80 p-3 rounded-full shadow-sm text-[#5b4f9f]">
                    <Volume2 size={24} />
                  </div>
              </div>

              {/* Decorative "Sparkle" Icons */}
              <div className="absolute -top-4 -right-4 bg-[#f2df79] p-4 rounded-full shadow-lg rotate-12">
                <Sparkles className="text-[#4e3d00] w-8 h-8" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#9cf4d3] p-4 rounded-full shadow-lg -rotate-12">
                <PartyPopper className="text-[#087258] w-8 h-8" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full max-w-4xl">
            <div className="text-8xl mb-8 animate-bounce">🤔</div>
            <div 
              className="relative bg-white w-full p-10 md:p-16 rounded-[3rem] border-b-[12px] border-[#e6e1ea] shadow-2xl cursor-pointer transform hover:scale-[1.02] transition-transform" 
              onClick={playAudio}
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-snug md:leading-tight font-extrabold text-[#5e4caf]">
                {currentQuestion.content ?? "Bạn cảm thấy thế nào?"}
              </h1>
              
              {/* Decorative Icons */}
              <div className="absolute -top-6 -left-6 bg-[#9cf4d3] p-4 rounded-full shadow-lg -rotate-12">
                <Sparkles className="text-[#087258] w-10 h-10" />
              </div>
              
              {/* Audio Button */}
              <div className="absolute -bottom-6 -right-6 bg-[#f2df79] p-5 rounded-full shadow-xl border-4 border-white text-[#4e3d00] hover:rotate-12 transition-transform">
                <Volume2 size={36} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Bottom Action Area: 2x2 Answer Grid ── */}
      <footer className="w-full p-8 pb-12">
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          {options.map(({ choice, text, emoji }, index) => {
            const btnStyle = buttonColors[index % buttonColors.length];
            
            let currentBg = btnStyle.bg;
            let currentBorder = btnStyle.border;
            let opacity = "";
            let transformClasses = `${btnStyle.activeShadow} active:border-b-[4px] active:translate-y-2`;

            if (selectedAnswerState) {
              transformClasses = ""; // Disable active effects when an answer is selected
              if (choice === selectedAnswerState.correctAnswer) {
                currentBg = "bg-[#4ade80]";
                currentBorder = "border-[#22c55e]";
              } else if (choice === selectedAnswerState.choice && !selectedAnswerState.isCorrect) {
                currentBg = "bg-[#f87171]";
                currentBorder = "border-[#ef4444]";
              } else {
                currentBg = "bg-[#e2e8f0]";
                currentBorder = "border-[#cbd5e1]";
                opacity = "opacity-50";
              }
            }

            return (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                disabled={!!selectedAnswerState}
                className={`h-32 md:h-40 rounded-xl flex flex-col items-center justify-center gap-2 group ${currentBg} border-b-[12px] ${currentBorder} ${btnStyle.shadow} ${transformClasses} ${opacity} transition-all duration-300`}
              >
                <div className={`${btnStyle.text} ${!selectedAnswerState ? 'group-hover:scale-110' : ''} transition-transform text-4xl`}>
                  {emoji || "🤔"}
                </div>
                <span className={`font-heading text-2xl font-extrabold ${btnStyle.text}`}>
                  {text}
                </span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
    </>
  );
};

export default QuizPage;
