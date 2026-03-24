import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminSlots from './pages/admin/Slots';
import AdminVehicles from './pages/admin/Vehicles';
import AdminUsers from './pages/admin/Users';
import AdminBookings from './pages/admin/Bookings';
import AdminRecords from './pages/admin/Records';
import AdminLocations from './pages/admin/Locations';

// User
import UserDashboard from './pages/user/Dashboard';
import BookSlot from './pages/user/BookSlot';
import MyBookings from './pages/user/MyBookings';
import MyVehicles from './pages/user/MyVehicles';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <main className="dashboard-content" style={{ paddingTop: '94px' }}>
        {children}
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid var(--border-glass)',
          borderTopColor: 'var(--accent-blue)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading SmartPark...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={user.user_type === 'Admin' ? '/admin/dashboard' : '/user/dashboard'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/user/dashboard" /> : <Register />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/slots" element={<ProtectedRoute adminOnly><DashboardLayout><AdminSlots /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/vehicles" element={<ProtectedRoute adminOnly><DashboardLayout><AdminVehicles /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><DashboardLayout><AdminUsers /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><DashboardLayout><AdminBookings /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/records" element={<ProtectedRoute adminOnly><DashboardLayout><AdminRecords /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/locations" element={<ProtectedRoute adminOnly><DashboardLayout><AdminLocations /></DashboardLayout></ProtectedRoute>} />

      {/* User Routes */}
      <Route path="/user/dashboard" element={<ProtectedRoute><DashboardLayout><UserDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/user/book" element={<ProtectedRoute><DashboardLayout><BookSlot /></DashboardLayout></ProtectedRoute>} />
      <Route path="/user/bookings" element={<ProtectedRoute><DashboardLayout><MyBookings /></DashboardLayout></ProtectedRoute>} />
      <Route path="/user/vehicles" element={<ProtectedRoute><DashboardLayout><MyVehicles /></DashboardLayout></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
