import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!email || !password) throw new Error("Please fill in all fields.");
            const success = await login(email, password);
            if (success) {
                // Get the user from local storage since state might not update immediately
                const userData = JSON.parse(localStorage.getItem('user') || '{}');

                if (userData.role === 'System Administrator') {
                    navigate('/admin');
                } else if (userData.role === 'Store Owner') {
                    navigate('/owner');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Invalid credentials');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 text-white selection:bg-blue-500/30">
            <div className="grid w-full lg:grid-cols-2">
                {/* Left Panel - Form */}
                <div className="flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md space-y-8"
                    >
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                                Welcome back
                            </h1>
                            <p className="mt-4 text-lg text-slate-400">
                                Enter your credentials to access your account.
                            </p>
                        </div>

                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <form onSubmit={handleSubmit}>
                                <CardHeader>
                                    <CardTitle>Sign In</CardTitle>
                                    <CardDescription>
                                        Enter your email regarding your account
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500"
                                        >
                                            <AlertCircle size={16} />
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            icon={Mail}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-300">Password</label>
                                            <Link to="#" className="text-sm text-blue-400 hover:text-blue-300">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            icon={Lock}
                                            required
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full" isLoading={loading}>
                                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>

                                    <p className="text-center text-sm text-slate-400">
                                        Don't have an account?{' '}
                                        <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                                            Sign up
                                        </Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Panel - Visual */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-white/5 backdrop-blur-3xl rounded-3xl m-4 border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 text-center p-10 max-w-xl"
                    >
                        <div className="mb-8 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl shadow-blue-500/30">
                                <span className="text-4xl font-bold text-white">R</span>
                            </div>
                        </div>
                        <h2 className="mb-6 text-3xl font-bold text-white">Roxiler Systems</h2>
                        <p className="text-lg text-slate-300">
                            Manage your store, track performance, and scale your business with our comprehensive dashboard solution.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
