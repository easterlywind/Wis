import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, Globe, Eye, Mic } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/contexts/SettingsContext";

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();

  const handleSave = () => {
    toast.success("Đã lưu cài đặt! ✅");
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#5e4caf] mb-2">Cài đặt</h1>
        <p className="font-body text-lg font-bold text-[#484552]">Tùy chỉnh ứng dụng theo ý thích của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <section className="bg-white p-8 rounded-[2rem] clay-card border-b-[8px] border-[#e6e1ea]">
          <div className="space-y-8">
            
            {/* Volume Setting */}
            <div className="bg-[#f7f2fb] p-6 rounded-3xl shadow-inner">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5e4caf] text-white flex items-center justify-center shadow-md">
                  <Volume2 className="w-6 h-6" />
                </div>
                <Label htmlFor="volume" className="text-xl font-heading font-extrabold text-[#1c1b21]">
                  Âm lượng
                </Label>
              </div>
              <div className="space-y-4 px-2">
                <Slider
                  id="volume"
                  value={[settings.volume]}
                  onValueChange={(v) => updateSettings({ volume: v[0] })}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-[#797583] font-body font-bold">
                  <span>Nhỏ</span>
                  <span className="font-heading font-extrabold text-[#5e4caf] text-xl">{settings.volume}%</span>
                  <span>Lớn</span>
                </div>
              </div>
            </div>

            {/* Language Setting */}
            <div className="bg-[#f7f2fb] p-6 rounded-3xl shadow-inner">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#006c53] text-white flex items-center justify-center shadow-md">
                  <Globe className="w-6 h-6" />
                </div>
                <Label className="text-xl font-heading font-extrabold text-[#1c1b21]">
                  Ngôn ngữ
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={settings.language === "vi" ? "default" : "outline"}
                  onClick={() => updateSettings({ language: "vi" })}
                  className={`text-lg h-16 rounded-[1.5rem] font-heading font-extrabold ${
                    settings.language === "vi" 
                      ? "bg-[#5e4caf] text-white shadow-md hover:bg-[#493598]" 
                      : "bg-white border-4 border-[#e6e1ea] text-[#484552] hover:bg-[#fdf8ff] hover:border-[#5e4caf]"
                  }`}
                  id="settings-lang-vi-btn"
                >
                  🇻🇳 Tiếng Việt
                </Button>
                <Button
                  variant={settings.language === "en" ? "default" : "outline"}
                  onClick={() => updateSettings({ language: "en" })}
                  className={`text-lg h-16 rounded-[1.5rem] font-heading font-extrabold ${
                    settings.language === "en" 
                      ? "bg-[#5e4caf] text-white shadow-md hover:bg-[#493598]" 
                      : "bg-white border-4 border-[#e6e1ea] text-[#484552] hover:bg-[#fdf8ff] hover:border-[#5e4caf]"
                  }`}
                  id="settings-lang-en-btn"
                >
                  🇬🇧 English
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calm Mode Setting */}
              <div className="bg-[#f7f2fb] p-6 rounded-3xl shadow-inner flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ebbb7a] text-[#4e3d00] flex items-center justify-center shadow-md">
                      <Eye className="w-6 h-6" />
                    </div>
                    <Label className="text-xl font-heading font-extrabold text-[#1c1b21]">
                      Bình Tĩnh
                    </Label>
                  </div>
                  <p className="font-body text-[#484552] mb-6 font-semibold">
                    Giảm màu sắc & chuyển động giúp bé tập trung hơn.
                  </p>
                </div>
                <Button
                  onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
                  className={`w-full text-lg h-16 rounded-[1.5rem] font-heading font-extrabold transition-all ${
                    settings.reducedMotion 
                      ? "bg-[#ebbb7a] text-[#4e3d00] shadow-md border-b-4 border-[#e9c34d] hover:bg-[#e9c34d] translate-y-0" 
                      : "bg-white border-4 border-[#e6e1ea] text-[#484552] hover:bg-[#fdf8ff]"
                  }`}
                  id="settings-calm-mode-btn"
                >
                  {settings.reducedMotion ? "Đang Bật" : "Đang Tắt"}
                </Button>
              </div>

              {/* Auto Read Aloud Setting */}
              <div className="bg-[#f7f2fb] p-6 rounded-3xl shadow-inner flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#5eb98f] text-white flex items-center justify-center shadow-md">
                      <Mic className="w-6 h-6" />
                    </div>
                    <Label className="text-xl font-heading font-extrabold text-[#1c1b21]">
                      Tự Đọc CHT
                    </Label>
                  </div>
                  <p className="font-body text-[#484552] mb-6 font-semibold">
                    Hệ thống sẽ tự đọc câu hỏi bằng giọng nói khi chơi.
                  </p>
                </div>
                <Button
                  onClick={() => updateSettings({ autoReadAloud: !settings.autoReadAloud })}
                  className={`w-full text-lg h-16 rounded-[1.5rem] font-heading font-extrabold transition-all ${
                    settings.autoReadAloud 
                      ? "bg-[#5eb98f] text-white shadow-md border-b-4 border-[#006c53] hover:bg-[#006c53] translate-y-0" 
                      : "bg-white border-4 border-[#e6e1ea] text-[#484552] hover:bg-[#fdf8ff]"
                  }`}
                  id="settings-auto-read-btn"
                >
                  {settings.autoReadAloud ? "Đang Bật" : "Đang Tắt"}
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button
                onClick={handleSave}
                className="w-full h-20 rounded-[2rem] font-heading font-extrabold text-[#006c53] bg-[#9cf4d3] border-b-[8px] border-[#006c53] text-2xl hover:bg-[#80d7b8] active:translate-y-2 active:border-b-0 transition-all clay-card"
                id="settings-save-btn"
              >
                Lưu cài đặt
              </Button>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
