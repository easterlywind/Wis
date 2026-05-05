import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LevelCard } from "@/components/LevelCard";
import { useState, useEffect } from "react";
import { Level } from "../types/level";
import { api } from "../lib/axios";
import { toast } from "sonner";
import { getDataWithRetry } from "@/lib/apiRetry";

const Levels = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDataWithRetry<Level[]>(
          () => api.get<Level[]>('/levels'),
          (d) => Array.isArray(d) && d.length > 0,
          { maxAttempts: 6, initialDelayMs: 400 }
        );
        setLevels(data);
      } catch (err: any) {
        console.error("Levels fetch error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Lỗi tải level";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  const handleStartLevel = (level: Level) => {
    if (!level.unlocked) {
      toast.error("Cấp độ này đang khóa 🔒");
      return;
    }
    toast.success(`Bắt đầu ${level.name}! 🚀`);
    navigate(`/levels/${level.id}`);
  };

  return (
    <div className="min-h-screen p-4 app-bg">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
            className="mb-6 rounded-xl font-bold border-2 bg-white/80"
            id="levels-back-btn"
          >
            <ArrowLeft className="mr-2" size={18} />
            Quay lại
          </Button>

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📚</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-foreground">
              Các cấp độ học tập
            </h1>
            <p className="text-lg text-muted-foreground font-semibold">
              Hoàn thành từng cấp độ để mở khóa thử thách mới!
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-bounce-gentle">📖</div>
            <p className="text-lg font-bold text-foreground">Đang tải cấp độ...</p>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto p-6 bg-white/80 rounded-2xl border-2 border-destructive/20 text-center shadow-soft">
            <div className="text-4xl mb-3">😔</div>
            <h2 className="text-xl font-extrabold mb-2 text-foreground">Không tải được</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => navigate("/home")}
              className="rounded-xl font-bold gradient-primary text-white"
            >
              ← Quay lại
            </Button>
          </div>
        )}

        {!loading && !error && levels.length > 0 && (
          <>
            <div className="space-y-5 animate-scale-in">
              {levels.map((level) => (
                <LevelCard
                  key={level.difficulty}
                  {...level}
                  onStart={() => handleStartLevel(level)}
                />
              ))}
            </div>

            <div className="mt-10 text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60 shadow-xs">
              <h3 className="text-xl font-extrabold mb-2 text-foreground">
                💡 Mẹo nhỏ
              </h3>
              <p className="text-muted-foreground font-semibold">
                Hoàn thành ít nhất 80% câu hỏi đúng để mở khóa cấp độ tiếp theo!
              </p>
            </div>
          </>
        )}

        {!loading && !error && levels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg text-muted-foreground font-semibold">Chưa có cấp độ nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Levels;
