import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AddBook from './pages/AddBook';
import AddAuthor from './pages/AddAuthor';
import AddPublisher from './pages/AddPublisher';
import AdminReports from './pages/AdminReports';
import AdminDatabaseView from './pages/AdminDatabaseView';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
};

// Home page with book list
const Home = () => (
    <Layout>
        <BookList />
    </Layout>
);

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/books/:isbn" element={<Layout><BookDetails /></Layout>} />

                    {/* Customer Routes */}
                    <Route path="/cart" element={<ProtectedRoute><Layout title="Shopping Cart"><Cart /></Layout></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Layout title="Checkout"><Checkout /></Layout></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Layout title="Order History"><OrderHistory /></Layout></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Layout title="My Profile"><Profile /></Layout></ProtectedRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute role="admin"><Layout title="Admin Dashboard"><AdminDashboard /></Layout></ProtectedRoute>} />
                    <Route path="/admin/add-book" element={<ProtectedRoute role="admin"><AddBook /></ProtectedRoute>} />
                    <Route path="/admin/add-author" element={<ProtectedRoute role="admin"><AddAuthor /></ProtectedRoute>} />
                    <Route path="/admin/add-publisher" element={<ProtectedRoute role="admin"><AddPublisher /></ProtectedRoute>} />
                    <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Layout title="Reports"><AdminReports /></Layout></ProtectedRoute>} />
                    <Route path="/admin/database" element={<ProtectedRoute role="admin"><Layout title="Database Viewer"><AdminDatabaseView /></Layout></ProtectedRoute>} />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
