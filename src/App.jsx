import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MouseSpotlight from './components/layout/MouseSpotlight';
import FloatingContact from './components/layout/FloatingContact';
import { ROUTES } from './constants/routes';
import { PROTECTED_ROLES } from './constants/roles';
import { AuthProvider } from './context/AuthContext';

const Home           = lazy(() => import('./pages/Home'));
const PropertyList   = lazy(() => import('./pages/PropertyList'));
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const Login          = lazy(() => import('./pages/Auth/Login'));
const Contact        = lazy(() => import('./pages/Contact'));
const About          = lazy(() => import('./pages/About'));

const ProtectedRoute = ({ children, allowedRoles = PROTECTED_ROLES }) => {
  const token = localStorage.getItem('token');
  const user  = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();

  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={ROUTES.HOME} replace />;

  return children;
};

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <MouseSpotlight />
    <Header />
    <main className="flex-grow"><Outlet /></main>
    <Footer />
    <FloatingContact />
  </div>
);

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path={`${ROUTES.DASHBOARD}/*`}
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />

            <Route path={ROUTES.LOGIN} element={<Login />} />

            <Route element={<PublicLayout />}>
              <Route path={ROUTES.HOME}       element={<Home />} />
              <Route path={ROUTES.ABOUT}      element={<About />} />
              <Route path={ROUTES.PROPERTIES} element={<PropertyList />} />
              <Route path="/property/:id"     element={<PropertyDetail />} />
              <Route path={ROUTES.CONTACT}    element={<Contact />} />
            </Route>

            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
