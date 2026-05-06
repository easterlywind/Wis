import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Brain } from "lucide-react";

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
        "relative cursor-pointer transition-all duration-300 hover:scale-105 active:translate-y-1 p-6 text-center rounded-[2rem] bg-white border-b-[8px] border-[#e6e1ea] clay-card",
        locked && "opacity-50 cursor-not-allowed",
        className
      )}
      role="button"
      tabIndex={0}
      aria-label={`Quiz: ${title}`}
    >
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#fdf8ff]/80 rounded-[2rem]">
          <span className="text-5xl drop-shadow-sm">🔒</span>
        </div>
      )}

      <div className="w-16 h-16 mx-auto bg-[#f7f2fb] rounded-2xl flex items-center justify-center mb-4 shadow-inner">
        <Brain className="text-[#5e4caf] w-10 h-10" />
      </div>

      <h3 className="text-xl font-heading font-extrabold text-[#1c1b21] mb-4">{title}</h3>

      {/* Stats */}
      <div className="text-sm font-body font-bold text-[#64748b] bg-[#f7f2fb] p-3 rounded-xl shadow-inner inline-flex flex-col gap-1 w-full">
        <p className="flex justify-between items-center">
          <span className="text-[#f2df79]">⭐</span> 
          <span className="text-[#5e4caf]">{maxScore} đ</span>
        </p>
        <p className="flex justify-between items-center">
          <span className="text-[#9cf4d3]">📝</span> 
          <span className="text-[#087258]">{attemptCount} lượt</span>
        </p>
      </div>
    </Card>
  );
};
