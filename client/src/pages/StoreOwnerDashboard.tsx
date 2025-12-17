import { useEffect, useState } from 'react';
import config from '../config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { TrendingUp, Star, Lock } from 'lucide-react';

interface Review {
    id: number;
    user: string;
    score: number;
    date: string;
}

interface StoreStats {
    hasStore: boolean; // Add check flag
    totalRatings: number;
    averageRating: number;
    ratingCounts: { [key: number]: number };
    reviews: Review[];
}

const StoreOwnerDashboard = () => {
    const [stats, setStats] = useState<StoreStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Store Registration State
    const [newStore, setNewStore] = useState({ name: '', address: '', email: '' });
    const [storeError, setStoreError] = useState('');
    const [storeSuccess, setStoreSuccess] = useState('');

    // Change Password State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${config.API_URL}/stats/store`, {
                headers
            });
            if (response.ok) {
                setStats(await response.json());
            }
        } catch (error) {
            console.error("Failed to fetch store stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        try {
            const res = await fetch(`${config.API_URL}/auth/password`, {
                method: 'PUT',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();
            if (res.ok) {
                setPasswordSuccess('Password updated successfully');
                setPasswordData({ currentPassword: '', newPassword: '' });
                setTimeout(() => setShowPasswordModal(false), 2000);
            } else {
                setPasswordError(data.message || 'Failed to update password');
            }
        } catch (error) {
            setPasswordError('An error occurred');
        }
    };

    const handleCreateStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setStoreError('');
        setStoreSuccess('');

        if (!newStore.name || !newStore.address || !newStore.email) {
            setStoreError('All fields are required');
            return;
        }

        try {
            const res = await fetch(`${config.API_URL}/stores`, {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(newStore)
            });
            const data = await res.json();
            if (res.ok) {
                setStoreSuccess('Store registered successfully!');
                fetchStats(); // Refresh to show dashboard
            } else {
                setStoreError(data.message || 'Failed to register store');
            }
        } catch (error) {
            setStoreError('An error occurred');
        }
    };

    if (loading) return <div className="text-white p-8">Loading dashboard...</div>;

    if (stats && !stats.hasStore) {
        return (
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Welcome, Store Owner!</h2>
                    <p className="text-slate-400">Please register your store to start tracking statistics.</p>
                </div>

                <div className="max-w-md mx-auto w-full mt-8">
                    <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Register Your Store</CardTitle>
                            <CardDescription>Enter details about your flagship store.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateStore} className="space-y-4">
                                {storeError && <div className="text-red-400 text-sm">{storeError}</div>}
                                {storeSuccess && <div className="text-green-400 text-sm">{storeSuccess}</div>}

                                <Input
                                    label="Store Name"
                                    placeholder="e.g. Roxiler Tech Store"
                                    value={newStore.name}
                                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Store Email"
                                    type="email"
                                    placeholder="store@roxiler.com"
                                    value={newStore.email}
                                    onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Store Address"
                                    placeholder="123 Tech Park, India"
                                    value={newStore.address}
                                    onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                                    required
                                />
                                <Button type="submit" className="w-full">Register Store</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="absolute top-8 right-8">
                    <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                        <Lock className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                </div>
                {/* Change Password Modal */}
                <Modal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    title="Change Password"
                >
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        {passwordError && <div className="text-red-400 text-sm">{passwordError}</div>}
                        {passwordSuccess && <div className="text-green-400 text-sm">{passwordSuccess}</div>}

                        <Input
                            label="Current Password"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            required
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            required
                        />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Update Password</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Store Dashboard</h2>
                    <p className="text-slate-400">Monitor your store performance and ratings.</p>
                </div>
                <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                    <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">
                            Average Rating
                        </CardTitle>
                        <Star className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.averageRating || 0} / 5</div>
                        <p className="text-xs text-slate-400">Based on {stats?.totalRatings || 0} reviews</p>
                    </CardContent>
                </Card>
                <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">
                            Total Reviews
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.totalRatings || 0}</div>
                        <p className="text-xs text-slate-400">Total feedback received</p>
                    </CardContent>
                </Card>
                <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">
                            5-Star Ratings
                        </CardTitle>
                        <Star className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.ratingCounts ? stats.ratingCounts[5] : 0}</div>
                        <p className="text-xs text-slate-400">Happy customers</p>
                    </CardContent>
                </Card>
                <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-200">
                            1-Star Ratings
                        </CardTitle>
                        <Star className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.ratingCounts ? stats.ratingCounts[1] : 0}</div>
                        <p className="text-xs text-slate-400">Areas to improve</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Recent Reviews</CardTitle>
                    <CardDescription>
                        Recent ratings and feedback from users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {stats?.reviews && stats.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {stats.reviews.map((review) => (
                                <div key={review.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">
                                            {review.user.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{review.user}</p>
                                            <p className="text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-400">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span className="font-bold">{review.score}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/5">
                            <div className="text-center text-slate-500">
                                <Star className="mx-auto h-8 w-8 opacity-50 mb-2" />
                                <p>No reviews yet.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Change Password Modal */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                title="Change Password"
            >
                <form onSubmit={handleChangePassword} className="space-y-4">
                    {passwordError && <div className="text-red-400 text-sm">{passwordError}</div>}
                    {passwordSuccess && <div className="text-green-400 text-sm">{passwordSuccess}</div>}

                    <Input
                        label="Current Password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowPasswordModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Update Password</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StoreOwnerDashboard;
