import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2 } from "lucide-react";
import { Quiz } from "@/types/quiz";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { getDataWithRetry } from "@/lib/apiRetry";
import { QuizCard } from "@/components/QuizCard";
import { useNavigate, useParams } from "react-router-dom";

interface QuizCardProps {
  id: string;
  title: string;
  maxScore: number;
  attemptCount: number;
  onClick?: () => void;
  locked?: boolean;
  className?: string;
}

export function QuizLevel() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [triedCount, setTriedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Level ID không hợp lệ");
      setLoading(false);
      return;
    }
    
    const endpoint = `/levels/${id}`;
    (async () => {
      try {
        const data = await getDataWithRetry<Quiz[]>(
          () => api.get<Quiz[]>(endpoint),
          (d) => Array.isArray(d) && d.length > 0,
          { maxAttempts: 6, initialDelayMs: 400 }
        );
        setQuizzes(data);
        const count = data.filter((q) => (q.attemptCounts ?? 0) > 0).length;
        setTriedCount(count);
        setLoading(false);
      } catch (err: any) {
        console.error("QuizLevel error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Không tải được dữ liệu level";
        setError(errorMsg);
        setLoading(false);
      }
    })();
  }, [id]);

  const handleStartQuiz = (quiz: Quiz) => {
    navigate("/quiz", { state: { quizId: quiz.id } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 pb-28 app-bg">
      <div className="w-full max-w-5xl">
        <Button
          variant="outline"
          onClick={() => navigate("/levels")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2" size={20} />
          Quay lại
        </Button>

        {loading && (
          <div className="text-center py-12">
            <p className="text-lg">Đang tải...</p>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg text-center">
            <div className="text-4xl mb-2">❌</div>
            <h2 className="text-xl font-bold mb-2 text-red-800">Lỗi tải Level</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={() => navigate("/levels")}>Quay lại Levels</Button>
          </div>
        )}

        {!loading && !error && quizzes.length > 0 && (
          <>
            {/* Emotion Grid */}
            <div className="mb-6 grid gap-5 grid-cols-3 sm:grid-cols-4 md:grid-cols-4">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  maxScore={quiz.maxScore ?? 0}
                  attemptCount={quiz.attemptCounts ?? 0}
                  onClick={() => handleStartQuiz(quiz)}
                />
              ))}
            </div>

            {/* Progress Summary */}
            <p className="text-[var(--emo-text)]">
              {triedCount} of {quizzes.length} learned
            </p>
          </>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Chưa có quiz cho level này</p>
          </div>
        )}
      </div>
    </div>
  );
}
