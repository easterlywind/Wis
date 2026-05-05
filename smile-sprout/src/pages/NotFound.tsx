import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 app-bg">
      <div className="text-center animate-scale-in">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-extrabold text-foreground mb-4">
          Không tìm thấy trang
        </h1>
        <p className="text-lg text-muted-foreground mb-8 font-semibold">
          Trang bạn tìm kiếm không tồn tại
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/home")}
          className="rounded-2xl font-extrabold gradient-primary text-white px-8 py-5 h-auto shadow-glow"
          id="notfound-home-btn"
        >
          🏠 Về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
