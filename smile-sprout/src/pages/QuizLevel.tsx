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
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/levels")}
          className="rounded-[1.5rem] font-heading font-extrabold h-14 px-6 border-b-[6px] border-[#e6e1ea] bg-white text-[#484552] hover:bg-[#fdf8ff] hover:text-[#1c1b21] active:border-b-0 active:translate-y-1 transition-all clay-card"
          id="quizlevel-back-btn"
        >
          <ArrowLeft className="mr-2" size={24} />
          Quay lại Lộ trình
        </Button>
      </div>

      {loading && (
        <div className="text-center py-20 bg-white p-8 rounded-[2rem] clay-card border-b-[8px] border-[#e6e1ea]">
          <div className="text-6xl mb-6 animate-bounce-gentle">📝</div>
          <p className="font-heading text-2xl font-extrabold text-[#5e4caf]">Đang tải danh sách bài tập...</p>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-md mx-auto p-8 bg-[#ffdad6] rounded-[2rem] border-b-[8px] border-[#e57f7f] text-center shadow-sm clay-card">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="font-heading text-2xl font-extrabold mb-2 text-[#93000a]">Không tải được</h2>
          <p className="font-body font-semibold text-[#ba1a1a] mb-6">{error}</p>
          <Button
            onClick={() => navigate("/levels")}
            className="w-full rounded-[1.5rem] font-heading font-extrabold bg-[#e54d68] text-white h-14 border-b-[6px] border-[#93000a] hover:bg-[#ba1a1a] active:border-b-0 active:translate-y-1 transition-all clay-card"
          >
            ← Quay lại Levels
          </Button>
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <>
          <div className="mb-8">
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#5e4caf] mb-2">Thử thách của Cấp Độ</h1>
            <p className="font-body text-lg font-bold text-[#484552]">Hoàn thành các bài tập bên dưới để mở khóa nội dung mới!</p>
          </div>

          {/* Quiz Grid */}
          <div className="mb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <div className="text-center p-6 bg-white rounded-[2rem] clay-card border-b-[8px] border-[#e6e1ea] max-w-sm mx-auto">
            <p className="font-heading text-2xl font-extrabold text-[#1c1b21]">
              ✅ Đã học: <span className="text-[#5eb98f]">{triedCount}</span> / <span className="text-[#5e4caf]">{quizzes.length}</span> bài
            </p>
          </div>
        </>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className="text-center py-20 bg-white p-8 rounded-[2rem] clay-card border-b-[8px] border-[#e6e1ea]">
          <div className="text-6xl mb-6">📭</div>
          <p className="font-heading text-2xl font-extrabold text-[#797583]">Chưa có bài tập nào cho cấp độ này</p>
        </div>
      )}
    </div>
  );
}
