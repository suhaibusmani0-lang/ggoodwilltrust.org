import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

// --- COMPONENTS IMPORTS ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import TermsAndConditions from "./components/TermsAndConditions";

// --- NGO PAGES IMPORTS ---
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProgramsAndProjectsPage from "./pages/Programs&projectsPage"; 
import ProgramsAndProjectsDetailsPage from "./pages/Programs&projectsDetailsPage";
import ContactPage from "./pages/ContactPage";
import DonatePage from "./pages/DonatePage"; 
import DocumentsPage from "./pages/DocumentsPage"; 
import CertificatesPage from "./pages/CertificatesPage"; // 👇 Naya import yahan add kiya hai

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
          
          <ScrollToTop />

          <Routes>
            
            {/* 🔴 --- ADMIN ROUTES --- 🔴 */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* 🟢 --- PUBLIC WEBSITE ROUTES --- 🟢 */}
            <Route path="/*" element={
              <>
                <Header />
                <main className="flex-grow pt-28 md:pt-36">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    
                    <Route path="/programs-projects" element={<ProgramsAndProjectsPage />} />
                    <Route path="/programs-projects/:id" element={<ProgramsAndProjectsDetailsPage />} />
                    
                    {/* Documents Routes */}
                    <Route path="/press/documents" element={<DocumentsPage />} />
                    <Route path="/documents" element={<DocumentsPage />} />
                    
                    {/* 👇 Certificates & Results ki actual route yahan set kardi hai 👇 */}
                    <Route path="/certificates-results" element={<CertificatesPage />} /> 

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