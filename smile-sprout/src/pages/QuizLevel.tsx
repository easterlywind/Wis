import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Quiz } from "@/types/quiz";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { getDataWithRetry } from "@/lib/apiRetry";
import { QuizCard } from "@/components/QuizCard";
import { useNavigate, useParams } from "react-router-dom";

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
    <div className="min-h-screen p-4 app-bg">
      <div className="container mx-auto max-w-5xl">
        <Button
          variant="outline"
          onClick={() => navigate("/levels")}
          className="mb-5 rounded-xl font-bold border-2 bg-white/80"
          id="quizlevel-back-btn"
        >
          <ArrowLeft className="mr-2" size={18} />
          Quay lại
        </Button>

        {loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-bounce-gentle">📝</div>
            <p className="text-lg font-bold text-foreground">Đang tải...</p>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto p-6 bg-white/80 rounded-2xl border-2 border-destructive/20 text-center shadow-soft">
            <div className="text-4xl mb-3">😔</div>
            <h2 className="text-xl font-extrabold mb-2 text-foreground">Không tải được</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => navigate("/levels")}
              className="rounded-xl font-bold gradient-primary text-white"
            >
              ← Quay lại Levels
            </Button>
          </div>
        )}

        {!loading && !error && quizzes.length > 0 && (
          <>
            {/* Quiz Grid */}
            <div className="mb-5 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
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
            <div className="text-center p-4 bg-white/60 rounded-2xl border border-white/60">
              <p className="text-base font-bold text-foreground">
                ✅ Đã học: <span className="text-primary">{triedCount}</span> / {quizzes.length} bài
              </p>
            </div>
          </>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg text-muted-foreground font-semibold">Chưa có quiz cho level này</p>
          </div>
        )}
      </div>
    </div>
  );
}
