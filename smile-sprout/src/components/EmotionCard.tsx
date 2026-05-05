import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmotionCardProps {
  emoji: string;
  name: string;
  color: string;
  onClick?: () => void;
  locked?: boolean;
  className?: string;
}

export const EmotionCard = ({ emoji, name, color, onClick, locked, className }: EmotionCardProps) => {
  return (
    <Card
      onClick={!locked ? onClick : undefined}
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-hover p-5 text-center rounded-2xl bg-white/90 border-2",
        locked && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ borderColor: color }}
      role="button"
      tabIndex={0}
      aria-label={`Chọn cảm xúc: ${name}`}
    >
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl">
          <span className="text-4xl">🔒</span>
        </div>
      )}
      <div className="text-5xl mb-2 animate-bounce-gentle">{emoji}</div>
      <h3 className="text-base font-extrabold text-foreground">{name}</h3>
    </Card>
  );
};
