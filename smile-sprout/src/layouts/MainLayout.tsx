import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Activity, User } from "lucide-react";
import { cn } from "@/lib/utils";
import mascot from "@/assets/mascot.png";
import { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { getStoredUser, clearSession } from "@/lib/auth-session";

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    if (user) {
      api.get("/users/me/stats").then(res => {
        if (res.data && res.data.currentLevel) {
          setLevel(res.data.currentLevel);
        }
      }).catch(err => console.error("Failed to fetch user level", err));
    }
  }, [user]);

  const navItems = [
    { path: "/home", icon: Home, label: "Trang chủ" },
    { path: "/levels", icon: BookOpen, label: "Học tập" },
    { path: "/practice", icon: Activity, label: "Hoạt động" },
    { path: "/progress", icon: User, label: "Hồ sơ" },
  ];

  return (
    <div className="flex h-screen bg-[#f4f6f9] font-body overflow-hidden">
      {/* Desktop Sidebar - Left Floating Panel */}
      <aside className="hidden md:flex flex-col w-72 bg-white m-4 rounded-[2.5rem] p-6 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.02)] border-4 border-white h-[calc(100vh-2rem)]">
        {/* Logo */}
        <div className="mb-8 pl-2 mt-4">
          <h1 className="text-4xl font-heading font-extrabold text-[#5b4f9f] leading-none tracking-tight">
            Smile<br/>Sprout
          </h1>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-200 shadow-sm shrink-0 bg-green-100 flex items-center justify-center">
             <img src={mascot} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-extrabold text-[#5b4f9f] leading-tight">
              Hello,<br/>{user?.name ? user.name.split(' ').pop() : 'Explorer'}!
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Cấp độ {level}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            // Because /home is active when path is exactly /home or /
            const isActive = location.pathname.startsWith(item.path) || (item.path === '/home' && location.pathname === '/');
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-[2rem] font-extrabold text-[17px] transition-all duration-300",
                  isActive
                    ? "bg-[#a6f0c6] text-[#0a472a] shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)] border border-[#8ce3b3]"
                    : "text-[#4b4f56] hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <item.icon size={22} className={cn("shrink-0", isActive ? "text-[#0a472a]" : "text-[#4b4f56]")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="mt-auto">
          <button
            onClick={() => {
              clearSession();
              navigate("/auth");
            }}
            className="w-full flex items-center justify-center py-4 rounded-3xl font-heading font-extrabold text-xl text-white bg-[#e57f7f] shadow-[0_6px_0_#c25b5b] hover:-translate-y-1 hover:shadow-[0_8px_0_#c25b5b] active:translate-y-2 active:shadow-none transition-all duration-200"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Preserved & Adjusted) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 pb-safe pt-2 px-4 z-50 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) || (item.path === '/home' && location.pathname === '/');
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-full py-2 gap-1 relative"
            >
              <div className={cn(
                "p-3 rounded-2xl transition-all duration-300",
                isActive ? "bg-[#a6f0c6]" : "bg-transparent"
              )}>
                <item.icon 
                  size={24} 
                  className={cn(
                    "transition-all duration-300",
                    isActive ? "text-[#0a472a] scale-110" : "text-[#4b4f56]"
                  )} 
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
