import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LayoutWrapper } from "./components/LayoutWrapper";
import { ThemeProvider } from "./context/ThemeContext";
import { ModalProvider } from "./context/ModalContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { AdminLayout } from "./components/admin/layout/AdminLayout";
import { DashboardHome } from "./components/admin/dashboard/DashboardHome";
import { HeroAdmin } from "./components/admin/hero/HeroAdmin";
import { SkillsAdmin } from "./components/admin/skills/SkillsAdmin";
import { ProjectsAdmin } from "./components/admin/projects/ProjectsAdmin";
import { JourneyAdmin } from "./components/admin/journey/JourneyAdmin";
import { ServicesAdmin } from "./components/admin/services/ServicesAdmin";
import { SettingsAdmin } from "./components/admin/settings/SettingsAdmin";
import { AboutAdmin } from "./components/admin/about/AboutAdmin";
import { CertificationsAdmin } from "./components/admin/certifications/CertificationsAdmin";
import { MessagesAdmin } from "./components/admin/messages/MessagesAdmin";
import { LoadingScreen } from "./components/LoadingScreen";
import "../src/styles/theme.css";

// Lazy load heavy components for performance
const Seed = lazy(() => import("./pages/Seed").then(m => ({ default: m.Seed })));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ModalProvider>
        <AnalyticsProvider>
          <TooltipProvider>
            <LayoutWrapper>
              <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<AnimatePresence><LoadingScreen /></AnimatePresence>}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<DashboardHome />} />
                      <Route path="dashboard" element={<DashboardHome />} />
                      <Route path="hero" element={<HeroAdmin />} />
                      <Route path="skills" element={<SkillsAdmin />} />
                      <Route path="projects" element={<ProjectsAdmin />} />
                      <Route path="journey" element={<JourneyAdmin />} />
                      <Route path="services" element={<ServicesAdmin />} />
                      <Route path="settings" element={<SettingsAdmin />} />
                      <Route path="about" element={<AboutAdmin />} />
                      <Route path="certifications" element={<CertificationsAdmin />} />
                      <Route path="messages" element={<MessagesAdmin />} />
                    </Route>

                    {/* Legacy/Utility Routes */}
                    <Route path="/seed" element={<Seed />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </LayoutWrapper>
          </TooltipProvider>
        </AnalyticsProvider>
      </ModalProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
