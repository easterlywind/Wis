import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";
import { EmotionCard } from "@/components/EmotionCard";
import { toast } from "sonner";
import { Quiz } from "@/types/quiz";
import { AnswerChoice } from "@/types/question";
import { getEmotionEmoji, getEmotionColor } from "@/types/emotion";
import { api } from "../lib/axios";
import { getDataWithRetry } from "@/lib/apiRetry";
import { detectMediaType, type MediaType } from "@/lib/utils";

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
  const [resultDialog, setResultDialog] = useState<{
    isOpen: boolean;
    isCorrect?: boolean;
    correctAnswer?: AnswerChoice;
  }>({ isOpen: false });
  const [error, setError] = useState<string | null>(null);

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

  // Detect media type when question changes
  useEffect(() => {
    const currentQuestion = quiz?.questions[currentIdx];
    setMediaError(false);
    if (currentQuestion?.mediaUrl) {
      detectMediaType(currentQuestion.mediaUrl).then((type) => {
        setMediaType(type);
      });
    }
  }, [currentIdx, quiz]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center app-bg gap-4">
        <div className="text-5xl animate-bounce-gentle">📝</div>
        <p className="text-xl font-bold text-foreground">Đang tải quiz...</p>
        <p className="text-muted-foreground">Chờ chút nhé!</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 app-bg">
        <Card className="max-w-md w-full p-8 text-center rounded-3xl bg-white/90 border-2 border-white/60 shadow-hover">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-2xl font-extrabold mb-3 text-foreground">Không tải được Quiz</h2>
          <p className="text-muted-foreground mb-6">{error || "Quiz không tồn tại"}</p>
          <Button
            onClick={() => navigate("/home")}
            className="rounded-2xl font-bold gradient-primary text-white px-6 py-3"
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
        <Card className="max-w-md w-full p-8 text-center rounded-3xl bg-white/90 border-2 border-white/60">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-extrabold mb-3">Không có câu hỏi</h2>
          <Button
            onClick={() => navigate("/home")}
            className="rounded-2xl font-bold gradient-primary text-white"
          >
            ← Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  const handleChoice = (choice: AnswerChoice) => {
    if (!currentQuestion) return;

    const isCorrect = choice === currentQuestion.correctAnswer;

    setResultDialog({
      isOpen: true,
      isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
    });

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      setResultDialog({ isOpen: false });
      if (currentIdx === quiz!.questions.length - 1) {
        setShowResult(true);
      } else {
        setCurrentIdx((i) => i + 1);
      }
    }, 1800);
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

  const playAudio = () => {
    if (!currentQuestion?.mediaUrl) {
      toast.error("Không có âm thanh để phát");
      return;
    }

    const audio = new Audio(currentQuestion.mediaUrl);
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
        <Card className="max-w-lg w-full p-10 text-center rounded-3xl bg-white/90 shadow-hover border-2 border-white/60 animate-scale-in">
          <div className="text-7xl mb-6 animate-bounce-gentle">
            {isExcellent ? "🎉" : "🌟"}
          </div>
          <h1 className="text-4xl font-extrabold mb-4 text-foreground">
            {isExcellent ? "Tuyệt vời!" : "Hoàn thành!"}
          </h1>
          <p className="text-2xl mb-2 text-muted-foreground">
            Bạn đã trả lời đúng
          </p>
          <p className="text-5xl font-extrabold text-primary mb-2">
            {score}/{totalQuestions}
          </p>
          <p className="text-lg text-muted-foreground mb-8">
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
              className="rounded-2xl font-extrabold gradient-primary text-white px-6 py-5 h-auto shadow-glow"
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

  return (
    <div className="min-h-screen p-4 app-bg">
      {/* ── Result Dialog Overlay ── */}
      {resultDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-scale-in">
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-sm w-full mx-4">
            <div className="text-6xl mb-4">
              {resultDialog.isCorrect ? "🎉" : "💪"}
            </div>
            <h2 className="text-2xl font-extrabold mb-3 text-foreground">
              {resultDialog.isCorrect ? "Chính xác!" : "Thử lại nhé!"}
            </h2>
            {!resultDialog.isCorrect && (
              <p className="text-lg text-muted-foreground">
                Đáp án đúng là:{" "}
                <span className="font-extrabold text-primary">{resultDialog.correctAnswer}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        {/* ── Top bar ── */}
        <div className="mb-5">
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
            className="mb-4 rounded-xl font-bold border-2 bg-white/80"
            id="quiz-back-btn"
          >
            <ArrowLeft className="mr-2" size={18} />
            Quay lại
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Trắc nghiệm cảm xúc 📝
            </h1>
            <div className="text-lg font-extrabold text-primary bg-primary/10 px-4 py-2 rounded-xl">
              {currentIdx + 1}/{totalQ}
            </div>
          </div>
        </div>

        {/* ── Question Card ── */}
        <Card
          className="p-8 md:p-10 mb-5 bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-white/60 shadow-soft animate-scale-in min-h-[45vh] flex flex-col"
          id="quiz-question-card"
        >
          {/* Question text */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground leading-relaxed">
              {currentQuestion.content ?? "Nhận diện cảm xúc sau"}
            </h2>
          </div>

          {/* Media display */}
          {currentQuestion.mediaUrl && (
            <div className="mb-6 flex justify-center">
              {!mediaError ? (
                <>
                  {mediaType === "video" ? (
                    <video
                      src={currentQuestion.mediaUrl}
                      controls
                      onError={() => setMediaError(true)}
                      className="rounded-2xl w-full max-w-2xl h-auto max-h-[28vh] shadow-soft"
                    />
                  ) : mediaType === "audio" ? (
                    <audio
                      src={currentQuestion.mediaUrl}
                      controls
                      onError={() => setMediaError(true)}
                      className="rounded-lg w-full max-w-sm"
                    />
                  ) : (
                    <img
                      src={currentQuestion.mediaUrl}
                      alt="Câu hỏi"
                      onError={() => setMediaError(true)}
                      className="rounded-2xl w-full max-w-2xl h-auto max-h-[28vh] shadow-soft object-contain"
                    />
                  )}
                </>
              ) : (
                <div className="p-4 bg-destructive/10 text-destructive rounded-xl font-semibold">
                  ⚠️ Không thể tải media
                </div>
              )}
            </div>
          )}

          {/* Audio button */}
          <div className="text-center mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={playAudio}
              className="gap-2 rounded-xl font-bold border-2"
              id="quiz-audio-btn"
            >
              <Volume2 size={18} />
              🔊 Nghe hướng dẫn
            </Button>
          </div>
          
          {/* Answer options */}
          <div className="mt-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {options.map(({ choice, text, emoji }) => (
                <EmotionCard
                  key={choice}
                  name={text}
                  emoji={emoji || choice}
                  color={getEmotionColor(text) || "hsl(var(--primary))"}
                  onClick={() => handleChoice(choice)}
                  className="cursor-pointer hover:scale-105 transition-all text-2xl font-extrabold"
                />
              ))}
            </div>
          </div>
        </Card>

        {/* ── Progress bar ── */}
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="gradient-success h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2 font-semibold">
          Câu {currentIdx + 1} / {totalQ}
        </p>
      </div>
    </div>
  );
};

export default QuizPage;
