import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";
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
      "p-6 gradient-card border-2 transition-all duration-300",
      unlocked && "hover:shadow-hover hover:scale-105",
      !unlocked && "opacity-60"
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold",
          unlocked ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {unlocked ? id : <Lock size={24} />}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1 text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          
          {unlocked && (
            <>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div 
                  className="gradient-success h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <Button onClick={onStart} className="w-full gradient-primary text-primary-foreground">
                {progress > 0 ? "Tiếp tục" : "Bắt đầu"}
              </Button>
            </>
          )}
          
          {!unlocked && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Lock size={16} />
              <span>Hoàn thành cấp độ trước để mở khóa</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
