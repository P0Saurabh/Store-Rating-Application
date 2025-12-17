import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MainLayout = ({ children }: { children: ReactNode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Rating App</h1>
                    <nav className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="font-semibold">Welcome, {user.name}</span>
                                {user.role === 'System Administrator' && <Link to="/admin" className="hover:underline">Admin Dashboard</Link>}
                                {user.role === 'Store Owner' && <Link to="/owner" className="hover:underline">Owner Dashboard</Link>}
                                {user.role === 'Normal User' && <Link to="/dashboard" className="hover:underline">Dashboard</Link>}
                                <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:underline">Login</Link>
                                <Link to="/signup" className="hover:underline">Sign Up</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>
            <footer className="bg-gray-800 text-white text-center p-4">
                &copy; {new Date().getFullYear()} Roxiler Systems. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;
