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
    <Card className={cn("p-6 gradient-card hover:shadow-hover transition-all duration-300", className)}>
      <div className="flex items-center gap-4">
        <div 
          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white"
          style={{ background: color || "var(--gradient-primary)" }}
        >
          {icon}
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};
