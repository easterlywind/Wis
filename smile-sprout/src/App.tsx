import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/Quiz";
import Levels from "./pages/Levels";
import Progress from "./pages/Progress";
import Practice from "./pages/Practice";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { QuizLevel } from "./pages/QuizLevel";
import { SettingsProvider } from "./contexts/SettingsContext";
import { MainLayout } from "./layouts/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <SettingsProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected routes – yêu cầu đăng nhập */}
            {/* Routes without MainLayout (Full screen) */}
            <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
            
            {/* Routes with MainLayout (App Navigation) */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/levels" element={<Levels />} />
              <Route path="/levels/:id" element={<QuizLevel />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </SettingsProvider>
);

export default App;
