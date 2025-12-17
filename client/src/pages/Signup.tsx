import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Building, Shield } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { motion } from 'framer-motion';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Normal User');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (name.length < 2) throw new Error("Name must be at least 2 characters long.");
            await signup(email, password, role, name, address);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4 text-white selection:bg-blue-500/30">
            <div className="grid w-full lg:grid-cols-2">
                {/* Left Panel - Visual (Swapped for variety) */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-white/5 backdrop-blur-3xl rounded-3xl m-4 border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 to-blue-500/20" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 text-center p-10 max-w-xl"
                    >
                        <h2 className="mb-6 text-3xl font-bold text-white">Join Our Platform</h2>
                        <p className="text-lg text-slate-300">
                            Create an account to start your journey. Whether you're a shopper, a store owner, or an administrator, we have the tools you need.
                        </p>
                    </motion.div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md space-y-8"
                    >
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-5xl">
                                Create Account
                            </h1>
                            <p className="mt-4 text-lg text-slate-400">
                                Get started with your free account today.
                            </p>
                        </div>

                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <form onSubmit={handleSubmit}>
                                <CardHeader>
                                    <CardTitle>Sign Up</CardTitle>
                                    <CardDescription>
                                        Fill in your details to register
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
                                        <label className="text-sm font-medium text-slate-300">Full Name</label>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            icon={User}
                                            required
                                        />
                                    </div>

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
                                        <label className="text-sm font-medium text-slate-300">Address</label>
                                        <Input
                                            type="text"
                                            placeholder="123 Main St"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            icon={Building}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Password</label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            icon={Lock}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Role</label>
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                            {['Normal User', 'Store Owner', 'System Administrator'].map((r) => (
                                                <div
                                                    key={r}
                                                    onClick={() => setRole(r)}
                                                    className={`cursor-pointer rounded-lg border p-3 text-center text-xs font-medium transition-all ${role === r
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                                                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                                                        }`}
                                                >
                                                    {r === 'Normal User' && <User className="mx-auto mb-1 h-5 w-5" />}
                                                    {r === 'Store Owner' && <Building className="mx-auto mb-1 h-5 w-5" />}
                                                    {r === 'System Administrator' && <Shield className="mx-auto mb-1 h-5 w-5" />}
                                                    {r}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full" isLoading={loading}>
                                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>

                                    <p className="text-center text-sm text-slate-400">
                                        Already have an account?{' '}
                                        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
