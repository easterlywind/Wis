import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  className?: string;
}

export const ProgressCard = ({ icon, title, value, subtitle, color, className }: ProgressCardProps) => {
  return (
    <Card className={cn("p-5 rounded-2xl bg-white/90 border-2 border-white/60 hover:shadow-hover transition-all duration-300", className)}>
      <div className="flex items-center gap-3">
        <div 
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ background: color || "var(--gradient-primary)" }}
        >
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5 font-semibold truncate">{title}</p>
          <p className="text-2xl font-extrabold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground font-semibold truncate">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};
