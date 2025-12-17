import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    Shield,
    Store,
    User,
    X
} from 'lucide-react';
import { Button } from '../components/Button';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard,
            roles: ['Normal User', 'System Administrator', 'Store Owner']
        },
        {
            label: 'Admin Panel',
            path: '/admin',
            icon: Shield,
            roles: ['System Administrator']
        },
        {
            label: 'Store Manager',
            path: '/owner',
            icon: Store,
            roles: ['Store Owner', 'System Administrator']
        },
    ];

    const filteredNavItems = navItems.filter(item =>
        user && item.roles.includes(user.role)
    );

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white selection:bg-blue-500/30">
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop & Mobile */}
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
                        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
                                <span className="text-white">R</span>
                            </div>
                            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                Roxiler
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-6">
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                                    <User size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="truncate font-medium text-white">{user?.email}</p>
                                    <p className="truncate text-xs text-slate-400">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-2">
                        {filteredNavItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon size={18} className={cn("transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="border-t border-white/10 p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Topbar - Mobile Only */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/50 px-4 backdrop-blur-xl lg:hidden">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                        >
                            <Menu size={20} />
                        </button>
                        <span className="font-semibold">Roxiler Systems</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
