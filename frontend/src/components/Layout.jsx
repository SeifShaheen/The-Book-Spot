import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, title }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <header className="main-header">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <span className="logo-icon">📚</span>
                        <span className="logo-text">Bookstore</span>
                    </Link>
                    <nav className="main-nav">
                        <Link to="/" className="nav-link">Browse</Link>
                        {user ? (
                            <>
                                <Link to="/cart" className="nav-link">🛒 Cart</Link>
                                <Link to="/orders" className="nav-link">My Orders</Link>
                                <Link to="/profile" className="nav-link">Profile</Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="nav-link admin-link">Admin</Link>
                                )}
                                <div className="user-menu">
                                    <span className="user-name">Hi, {user.FirstName}</span>
                                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                                </div>
                            </>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-secondary">Login</Link>
                                <Link to="/register" className="btn btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="main-content">
                {title && <h1 className="page-title">{title}</h1>}
                {children}
            </main>

            <footer className="main-footer">
                <p>&copy; {new Date().getFullYear()} Bookstore System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
