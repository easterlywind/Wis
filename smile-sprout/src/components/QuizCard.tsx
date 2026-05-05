import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  id: string;
  title: string;
  maxScore: number;
  attemptCount: number;
  onClick?: () => void;
  locked?: boolean;
  className?: string;
}

export const QuizCard = ({
  id,
  title,
  maxScore,
  attemptCount,
  onClick,
  locked,
  className,
}: QuizCardProps) => {
  return (
    <Card
      onClick={!locked ? onClick : undefined}
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-hover p-5 text-center rounded-2xl bg-white/90 border-2 border-white/60",
        locked && "opacity-50 cursor-not-allowed",
        className
      )}
      role="button"
      tabIndex={0}
      aria-label={`Quiz: ${title}`}
    >
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      <h3 className="text-base font-extrabold text-foreground mb-2">{title}</h3>

      {/* Stats */}
      <div className="text-sm text-muted-foreground font-semibold space-y-1">
        <p>⭐ Điểm: {maxScore}</p>
        <p>📝 Lượt thử: {attemptCount}</p>
      </div>
    </Card>
  );
};
