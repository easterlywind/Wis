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
          className="mb-6 bg-white/80 border-orange-300 text-gray-800 hover:bg-orange-50"
        >
          <ArrowLeft className="mr-2" size={20} />
          Quay lại
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Cài đặt ⚙️
          </h1>
          <p className="text-xl text-gray-700">
            Tùy chỉnh ứng dụng theo ý thích
          </p>
        </div>

        <Card className="p-8 gradient-card shadow-hover mb-6 animate-scale-in">
          <div className="space-y-8">
            {/* Volume Setting */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Volume2 size={32} className="text-primary" />
                <Label htmlFor="volume" className="text-2xl font-bold text-foreground">
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
                <div className="flex justify-between text-muted-foreground text-lg">
                  <span>Nhỏ</span>
                  <span className="font-bold text-primary text-2xl">{volume[0]}%</span>
                  <span>Lớn</span>
                </div>
              </div>
            </div>

            {/* Language Setting */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Globe size={32} className="text-primary" />
                <Label className="text-2xl font-bold text-foreground">
                  Ngôn ngữ 🌍
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={language === "vi" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setLanguage("vi")}
                  className={`text-xl h-16 ${
                    language === "vi" 
                      ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white" 
                      : ""
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setLanguage("en")}
                  className={`text-xl h-16 ${
                    language === "en" 
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white" 
                      : ""
                  }`}
                >
                  🇬🇧 English
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              size="lg"
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white hover:opacity-90 text-2xl py-8 h-auto"
            >
              💾 Lưu cài đặt
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-white/90 backdrop-blur">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              💡 <strong>Mẹo:</strong> Điều chỉnh âm lượng phù hợp để nghe rõ hướng dẫn nhé!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
