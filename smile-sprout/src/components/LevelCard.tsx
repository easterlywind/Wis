import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelCardProps {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  difficulty: number;
  requiredPoints: number;
  progress: number;
  onStart?: () => void;
}

export const LevelCard = ({
  id,
  name,
  description,
  unlocked,
  progress = 0,
  onStart,
}: LevelCardProps) => {  
  return (
    <Card className={cn(
      "p-6 rounded-2xl bg-white/90 border-2 transition-all duration-300",
      unlocked && "hover:shadow-hover hover:-translate-y-1 border-white/60",
      !unlocked && "opacity-50 border-muted"
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold",
          unlocked ? "gradient-primary text-white shadow-sm" : "bg-muted text-muted-foreground"
        )}>
          {unlocked ? id : <Lock size={20} />}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-extrabold mb-1 text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mb-3 font-semibold">{description}</p>
          
          {unlocked && (
            <>
              <div className="w-full bg-muted rounded-full h-2.5 mb-3">
                <div 
                  className="gradient-success h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <Button
                onClick={onStart}
                className="w-full rounded-xl font-bold gradient-primary text-white shadow-sm"
              >
                {progress > 0 ? "Tiếp tục →" : "Bắt đầu →"}
              </Button>
            </>
          )}
          
          {!unlocked && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
              <Lock size={14} />
              <span>Hoàn thành cấp độ trước</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
