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
        "relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-hover p-6 text-center gradient-card border-2",
        locked && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
          <span className="text-4xl">🔒</span>
        </div>
      )}

      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>

      {/* Render progress */}
      <div className="text-sm text-foreground/80">
        <p>Score: {maxScore}</p>
        <p>Attempts: {attemptCount}</p>
      </div>
    </Card>
  );
};
