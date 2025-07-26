import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Index from './pages/Index';
import Discover from './pages/Discover';
import Tourism from './pages/Tourism';
import Gallery from './pages/Gallery';
import ContentHub from './pages/ContentHub';
import Services from './pages/Services';
import NotFound from './pages/NotFound';

// Authentication pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Regional detail pages
import RegionDetail from './pages/RegionDetail';
import AttractionDetail from './pages/AttractionDetail';
import TourPackageDetail from './pages/TourPackageDetail';
import ContentDetail from './pages/ContentDetail';

// Marketplace pages
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import UserProfile from './pages/dashboard/UserProfile';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import GuideDashboard from './pages/dashboard/GuideDashboard';
import TouristDashboard from './pages/dashboard/TouristDashboard';
import VirtualTourDetail from './pages/VirtualTourDetail';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/discover" element={<Layout><Discover /></Layout>} />
              <Route path="/tourism" element={<Layout><Tourism /></Layout>} />
              <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
              <Route path="/content-hub" element={<Layout><ContentHub /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              
              {/* Marketplace Routes */}
              <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
              <Route path="/marketplace/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Detail Pages */}
              <Route path="/regions/:id" element={<Layout><RegionDetail /></Layout>} />
              <Route path="/attractions/:id" element={<Layout><AttractionDetail /></Layout>} />
              <Route path="/tours/:id" element={<Layout><TourPackageDetail /></Layout>} />
              <Route path="/content/:id" element={<Layout><ContentDetail /></Layout>} />
              
              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
              <Route path="/dashboard/guide" element={<ProtectedRoute requiredRole="guide"><Layout><GuideDashboard /></Layout></ProtectedRoute>} />
              <Route path="/dashboard/tourist" element={<ProtectedRoute requiredRole="tourist"><Layout><TouristDashboard /></Layout></ProtectedRoute>} />
              
              {/* Virtual Tour Route */}
              <Route path="/virtual-tours/:id" element={<Layout><VirtualTourDetail /></Layout>} />
              
              {/* 404 Route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;