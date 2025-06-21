import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout & Pages
import Layout from "./components/layout/Layout";
import Home from "./pages/Index";
import AboutUs from "./pages/AboutUs";
// import Research from "./pages/Research";
import RnaStructure from "./pages/RnaStructure";
import NotFound from "./pages/NotFound";
import Predict from "./pages/Predict";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ Imported ProfilePage

// ✅ ProtectedRoute
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Auth Route */}
              <Route path="/auth" element={<AuthPage />} />

              {/* All protected routes wrapped with layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<AboutUs />} />
                {/* <Route path="research" element={<Research />} /> */}
                <Route
                  path="rna-structure"
                  element={
                    <ProtectedRoute>
                      <RnaStructure />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="predict" element={<Predict />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
