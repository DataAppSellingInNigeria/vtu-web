// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Overview';
import Wallet from '../pages/dashboard/Wallet';
import WalletPage from '../pages/wallet/WalletPage';
import Transactions from '../pages/dashboard/Transactions';
import NotFound from '../pages/NotFound';
import DahaTechLanding from '../pages/LandingPage';
import PrivacyPolicy from '../components/PrivacyPolicy';
import TermsAndConditions from '../components/TermsAndConditions';

import BuyDataPage from "../pages/buy/BuyDataPage";
import BuyAirtimePage from "../pages/buy/BuyAirtimePage";
import BuyCablePage from "../pages/buy/BuyCablePage";
import BuyExamPinPage from "../pages/buy/BuyExamPinPage";
import TransactionsPage from '../pages/transactions/Transactions';

// Layout
import DashboardLayout from '../layouts/DashboardLayout';
import PaystackReturn from '../pages/wallet/PaystackReturn';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return isAuthenticated
        ? children
        : <Navigate to="/login" replace state={{ from: location }} />;
}

function AuthRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname;

    if (isAuthenticated) {
        return <Navigate to={from || "/wallet-page"} replace />;
    }

    return children;
}


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}

                <Route path="/" element={<DahaTechLanding />} />
                <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                <Route path='/terms-and-conditions' element={<TermsAndConditions />} />

                <Route
                    path="/login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <AuthRoute>
                            <Register />
                        </AuthRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="wallet" element={<Wallet />} />
                    <Route path="transactions" element={<Transactions />} />
                </Route>

                <Route
                    path="/buy"
                    element={
                        <ProtectedRoute>
                            <Outlet /> {/* or a minimal layout with Navbar/Footer */}
                        </ProtectedRoute>
                    }
                >
                    <Route path="data" element={<BuyDataPage />} />
                    <Route path="airtime" element={<BuyAirtimePage />} />
                    <Route path="cable" element={<BuyCablePage />} />
                    <Route path="pin" element={<BuyExamPinPage />} />
                    <Route path="transactions-logs" element={<TransactionsPage />} />
                </Route>

                <Route path="/wallet-page" element={
                    <ProtectedRoute>
                        <WalletPage />
                    </ProtectedRoute>
                } />

                <Route path="/paystack/return" element={
                    <ProtectedRoute>
                        <PaystackReturn />
                    </ProtectedRoute>
                } />

                {/* Catch-All */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes