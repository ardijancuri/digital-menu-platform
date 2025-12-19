import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import LandingPage from './pages/LandingPage';
import ApplyPage from './pages/ApplyPage';
import PublicMenuPage from './pages/PublicMenuPage';
import UserLogin from './pages/UserLogin';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';

import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SupportPage from './pages/SupportPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminApplications from './pages/admin/AdminApplications';
import AdminUsers from './pages/admin/AdminUsers';

// Dashboard Pages
import DashboardLayout from './pages/dashboard/DashboardLayout';
import SettingsPage from './pages/dashboard/SettingsPage';
import CategoriesPage from './pages/dashboard/CategoriesPage';
import ProductsPage from './pages/dashboard/ProductsPage';
import PreviewPage from './pages/dashboard/PreviewPage';

// POS Pages
import POSLayout from './layouts/POSLayout';
import POSDashboard from './pages/pos/POSDashboard';
import OrderTaking from './pages/pos/OrderTaking';
import TableManagement from './pages/pos/TableManagement';
import StaffManagement from './pages/pos/StaffManagement';
import OrderHistory from './pages/pos/OrderHistory';
import Reports from './pages/pos/Reports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/menu/:slug" element={<PublicMenuPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute requireAdmin>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/settings" replace />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="preview" element={<PreviewPage />} />
          </Route>

          {/* POS Routes */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute>
                <POSLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<POSDashboard />} />
            <Route path="order" element={<OrderTaking />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="reports" element={<ProtectedRoute restrictManagers><Reports /></ProtectedRoute>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
