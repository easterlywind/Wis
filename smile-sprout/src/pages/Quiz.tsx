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
      <div className="min-h-screen flex items-center justify-center app-bg">
        <p>Đang tải quiz...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Lỗi tải Quiz</h2>
          <p className="text-muted-foreground mb-6">{error || "Quiz không tồn tại"}</p>
          <Button onClick={() => navigate("/home")}>Quay lại Trang chủ</Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions?.[currentIdx];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Lỗi</h2>
          <p className="text-muted-foreground mb-6">Không có câu hỏi</p>
          <Button onClick={() => navigate("/home")}>Quay lại Trang chủ</Button>
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
    }, 1500);
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
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-2xl w-full p-8 text-center gradient-card shadow-active animate-scale-in">
          <div className="text-6xl mb-6 animate-bounce-gentle">
            {score === totalQuestions ? "🎉" : "🌟"}
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Hoàn thành!
          </h1>
          <p className="text-2xl mb-6 text-muted-foreground">
            Bạn đã trả lời đúng{" "}
            <span className="text-primary font-bold">{score}</span> /{" "}
            {totalQuestions} câu
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => {
                setCurrentIdx(0);
                setScore(0);
                setShowResult(false);
              }}
              className="gradient-primary text-gray-900"
            >
              Làm lại
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/home")}
            >
              Về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 app-bg">
      {resultDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">
              {resultDialog.isCorrect ? "🎉 Chính xác!" : "❌ Sai rồi!"}
            </h2>
            {!resultDialog.isCorrect && (
              <p className="text-lg">
                Đáp án đúng là:{" "}
                <span className="font-bold">{resultDialog.correctAnswer}</span>
              </p>
            )}
          </div>
        </div>
      )}
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2" size={20} />
            Quay lại
          </Button>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">
              Trắc nghiệm cảm xúc
            </h1>
            <div className="text-lg font-semibold text-muted-foreground">
              Câu {currentIdx + 1}/{quiz?.questions?.length ?? 0}
            </div>
          </div>
        </div>

        <Card className="p-10 mb-6 bg-white/90 backdrop-blur border border-orange-200 shadow-hover animate-scale-in min-h-[50vh] flex flex-col">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 leading-snug">
              {currentQuestion.content ?? "Nhan dien cai sau"}
            </h2>

            {/* Display Media */}
            {currentQuestion.mediaUrl && (
              <div className="mb-6 flex justify-center">
                {!mediaError ? (
                  <>
                    {mediaType === "video" ? (
                      <video
                        src={currentQuestion.mediaUrl}
                        controls
                        onError={() => setMediaError(true)}
                        className="rounded-2xl w-full max-w-3xl h-auto max-h-[28vh] md:max-h-[32vh] shadow-lg"
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
                        alt="Question media"
                        onError={() => setMediaError(true)}
                        className="rounded-2xl w-full max-w-3xl h-auto max-h-[28vh] md:max-h-[32vh] shadow-lg object-contain"
                      />
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                    ⚠️ Không thể tải media từ URL: {currentQuestion.mediaUrl}
                  </div>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={playAudio}
              className="gap-2"
            >
              <Volume2 size={18} />
              Nghe hướng dẫn
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.map(({ choice, text, emoji }) => (
                <EmotionCard
                  key={choice}
                  name={text}
                  emoji={emoji || choice}
                  color={getEmotionColor(text) || "hsl(var(--primary))"}
                  onClick={() => handleChoice(choice)}
                  className="cursor-pointer hover:scale-110 transition-all text-3xl font-bold"
                />
              ))}
            </div>
          </div>
        </Card>

        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="gradient-success h-3 rounded-full transition-all duration-500"
            style={{
              width: `${((currentIdx + 1) / (quiz?.questions?.length ?? 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
