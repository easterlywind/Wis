import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, Globe } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();
  const [volume, setVolume] = useState([80]);
  const [language, setLanguage] = useState("vi");

  const handleSave = () => {
    toast.success("Đã lưu cài đặt! ✅");
  };

  return (
    <div className="min-h-screen p-4 app-bg">
      <div className="container mx-auto max-w-3xl">
        <Button 
          variant="outline" 
          onClick={() => navigate("/home")}
          className="mb-6 rounded-xl font-bold border-2 bg-white/80"
          id="settings-back-btn"
        >
          <ArrowLeft className="mr-2" size={18} />
          Quay lại
        </Button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚙️</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-foreground">
            Cài đặt
          </h1>
          <p className="text-lg text-muted-foreground font-semibold">
            Tùy chỉnh ứng dụng theo ý thích
          </p>
        </div>

        <Card className="p-8 rounded-3xl bg-white/90 backdrop-blur-sm shadow-soft border-2 border-white/60 mb-5 animate-scale-in">
          <div className="space-y-8">
            {/* Volume Setting */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Volume2 size={20} className="text-white" />
                </div>
                <Label htmlFor="volume" className="text-xl font-extrabold text-foreground">
                  Âm lượng 🔊
                </Label>
              </div>
              <div className="space-y-4">
                <Slider
                  id="volume"
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-muted-foreground text-base font-semibold">
                  <span>🔈 Nhỏ</span>
                  <span className="font-extrabold text-primary text-xl">{volume[0]}%</span>
                  <span>🔊 Lớn</span>
                </div>
              </div>
            </div>

            {/* Language Setting */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
                  <Globe size={20} className="text-white" />
                </div>
                <Label className="text-xl font-extrabold text-foreground">
                  Ngôn ngữ 🌍
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={language === "vi" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setLanguage("vi")}
                  className={`text-lg h-14 rounded-2xl font-bold ${
                    language === "vi" 
                      ? "gradient-primary text-white shadow-glow" 
                      : "border-2"
                  }`}
                  id="settings-lang-vi-btn"
                >
                  🇻🇳 Tiếng Việt
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setLanguage("en")}
                  className={`text-lg h-14 rounded-2xl font-bold ${
                    language === "en" 
                      ? "gradient-secondary text-white shadow-glow" 
                      : "border-2"
                  }`}
                  id="settings-lang-en-btn"
                >
                  🇬🇧 English
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              size="lg"
              className="w-full rounded-2xl font-extrabold gradient-success text-white text-xl py-7 h-auto shadow-sm hover:shadow-hover transition-all"
              id="settings-save-btn"
            >
              💾 Lưu cài đặt
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/60">
          <div className="text-center">
            <p className="text-base text-muted-foreground font-semibold">
              💡 <strong>Mẹo:</strong> Điều chỉnh âm lượng phù hợp để nghe rõ hướng dẫn nhé!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
