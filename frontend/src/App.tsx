import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AIAssistant } from "./components/aiAssistant/AIAssistant";
import ProjectDetails from "./pages/ProjectDetails";

import { AuthProvider } from "./contexts/AuthContext";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProjects from "./pages/admin/Projects";
import AdminAbout from "./pages/admin/About";
import AdminSkills from "./pages/admin/Skills";
import AdminEducation from "./pages/admin/Education";
import AdminCertifications from "./pages/admin/Certifications";
import AdminHobbies from "./pages/admin/Hobbies";
import AdminAchievements from "./pages/admin/Achievements";
import { AdminLayout } from "./components/admin/AdminLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="certifications" element={<AdminCertifications />} />
                <Route path="hobbies" element={<AdminHobbies />} />
                <Route path="achievements" element={<AdminAchievements />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <AIAssistant />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;