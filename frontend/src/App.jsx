import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import ApplyPage from './pages/ApplyPage';
import PublicMenuPage from './pages/PublicMenuPage';
import UserLogin from './pages/UserLogin';

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/menu/:slug" element={<PublicMenuPage />} />

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

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
