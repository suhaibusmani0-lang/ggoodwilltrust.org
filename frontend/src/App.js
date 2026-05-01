import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InventoryPage from "./pages/InventoryPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import ContactPage from "./pages/ContactPage";
import FinancePage from "./pages/FinancePage";
import TradeInPage from "./pages/TradeInPage";
import ReferralPage from "./pages/ReferralPage";
import ScheduleVisitPage from "./pages/ScheduleVisitPage";
import AboutPage from "./pages/AboutPage";
import WarrantyInfoPage from "./pages/WarrantyInfoPage";
import WarrantySchedulePage from "./pages/WarrantySchedulePage";
import ServiceDeptPage from "./pages/ServiceDeptPage";
import PartsDeptPage from "./pages/PartsDeptPage";
import BodyShopPage from "./pages/BodyShopPage";
import GlassRepairPage from "./pages/GlassRepairPage";
import StartPurchasePage from "./pages/StartPurchasePage";
import CarFinderPage from "./pages/CarFinderPage";
import SitemapPage from "./pages/SitemapPage"; // NAYA: Sitemap import kiya
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInboxPage from "./pages/admin/AdminInboxPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import VehicleForm from "./pages/admin/VehicleForm";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import TermsAndConditions from "./components/TermsAndConditions";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/find-car" element={<InventoryPage />} />
            <Route path="/find-a-car" element={<CarFinderPage />} />
            <Route path="/start-your-vehicle-purchase" element={<StartPurchasePage />} />
            <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/trade-in" element={<TradeInPage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/schedule-visit" element={<ScheduleVisitPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Services Routes */}
            <Route path="/services/service-dept" element={<ServiceDeptPage />} />
            <Route path="/services/parts-dept" element={<PartsDeptPage />} />
            <Route path="/services/body-shop" element={<BodyShopPage />} />
            <Route path="/services/glass" element={<GlassRepairPage />} />

            {/* Warranty Routes */}
            <Route path="/warranty/info" element={<WarrantyInfoPage />} />
            <Route path="/warranty/schedule" element={<WarrantySchedulePage />} />

            {/* Sitemap Route Added Here */}
            <Route path="/sitemap" element={<SitemapPage />} />

            {/* T&C Route */}
            <Route path="/terms" element={<TermsAndConditions />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/inbox" element={<ProtectedRoute><AdminInboxPage /></ProtectedRoute>} />
            <Route path="/admin/vehicles/new" element={<ProtectedRoute><VehicleForm /></ProtectedRoute>} />
            <Route path="/admin/vehicles/edit/:id" element={<ProtectedRoute><VehicleForm /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
    </div>
  );
}

export default App;