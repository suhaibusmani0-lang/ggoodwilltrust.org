import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop"; // 👇 Yahan import kiya hai

// --- NGO PAGES IMPORTS ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import ProjectsPage from "./pages/ProjectsPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import DonatePage from "./pages/DonatePage"; 
import DocumentsPage from "./pages/DocumentsPage"; 
import TermsAndConditions from "./components/TermsAndConditions";

// --- ADMIN & AUTH IMPORTS ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <AuthProvider>
        <BrowserRouter>
          
          {/* 👇 Ye component har route change pe page ko top pe le jayega 👇 */}
          <ScrollToTop />

          <Routes>
            
            {/* 🔴 --- ADMIN ROUTES (Bina Header/Footer ke bilkul alag khulenge) --- 🔴 */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 🟢 --- PUBLIC WEBSITE ROUTES (Inke upar Header aur niche Footer aayega) --- 🟢 */}
            <Route path="/*" element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/programs" element={<ProgramsPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    
                    {/* Gallery Routes */}
                    <Route path="/press/news-gallery" element={<GalleryPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />

                    {/* Documents Routes */}
                    <Route path="/press/documents" element={<DocumentsPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />

                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/donate" element={<DonatePage />} /> 
                    <Route path="/terms" element={<TermsAndConditions />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
    </div>
  );
}

export default App;