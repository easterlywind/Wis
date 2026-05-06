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
  name,
  description,
  unlocked,
  difficulty,
  progress = 0,
  onStart,
}: LevelCardProps) => {  
  return (
    <Card className={cn(
      "p-6 clay-card group transition-all duration-300",
      unlocked ? "cursor-pointer" : "opacity-60 saturate-50 hover:transform-none shadow-[4px_4px_0px_hsla(220,20%,90%,1)] border-white/50"
    )} onClick={unlocked ? onStart : undefined}>
      <div className="flex items-center gap-5">
        <div className={cn(
          "flex-shrink-0 w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-2xl font-extrabold shadow-inner",
          unlocked ? "gradient-primary text-white" : "bg-slate-200 text-slate-400"
        )}>
          {unlocked ? difficulty : <Lock size={28} className="drop-shadow-sm" />}
        </div>
        
        <div className="flex-1">
          <h3 className={cn("text-2xl font-bold mb-1", unlocked ? "text-slate-800" : "text-slate-500")}>
            {name}
          </h3>
          <p className="text-base text-slate-500 font-medium mb-3">{description || (unlocked ? "Hoàn thành các thử thách" : "Hoàn thành cấp độ trước")}</p>
          
          {unlocked && (
            <div className="mt-2 flex gap-4 items-center">
              <div className="flex-1 bg-slate-100 rounded-full h-3 border border-slate-200 shadow-inner overflow-hidden">
                <div 
                  className="gradient-success h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onStart?.();
                }}
                className="clay-btn text-base px-6 py-5 bg-white text-primary"
              >
                {progress > 0 ? "Tiếp tục" : "Bắt đầu"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
