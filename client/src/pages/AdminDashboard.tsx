import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Plus, Search, MoreHorizontal, Users, Activity, Store as StoreIcon } from 'lucide-react';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    address: string;
    createdAt: string;
}

interface Store {
    id: number;
    name: string;
    email: string;
    address: string;
    rating: number;
}

interface Stats {
    totalRatings: number;
    totalUsers: number;
    totalStores: number;
    activeUsers: number;
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');
    const [showAddUser, setShowAddUser] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // Add User Form State
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    const [formError, setFormError] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
        try {
            const [usersRes, storesRes, statsRes] = await Promise.all([
                fetch('http://localhost:5000/api/users', { headers }),
                fetch('http://localhost:5000/api/stores', { headers }),
                fetch('http://localhost:5000/api/stats/admin', { headers })
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (storesRes.ok) setStores(await storesRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        try {
            const res = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            if (res.ok) {
                setShowAddUser(false);
                setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
                fetchData(); // Refresh data
            } else {
                setFormError(data.message || 'Failed to create user');
            }
        } catch (error) {
            setFormError('An error occurred');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.address && user.address.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-white p-8">Loading dashboard...</div>;

    const statCards = [
        { title: "Total Ratings", value: stats?.totalRatings || 0, icon: Activity, color: "text-green-400" },
        { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400" },
        { title: "Total Stores", value: stats?.totalStores || 0, icon: StoreIcon, color: "text-purple-400" },
        { title: "Active Users", value: stats?.activeUsers || 0, icon: Activity, color: "text-orange-400" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h2>
                    <p className="text-slate-400">Manage users, stores, and system settings.</p>
                </div>
                <Button onClick={() => setShowAddUser(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card key={index} className="border-white/5 bg-white/5 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs & Content */}
            <div className="space-y-4">
                <div className="flex space-x-2 border-b border-white/10 pb-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'stores' ? 'text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-white'}`}
                    >
                        Stores
                    </button>
                </div>

                <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>{activeTab === 'users' ? 'Users' : 'Stores'}</CardTitle>
                        <CardDescription>
                            {activeTab === 'users' ? 'Manage registered users.' : 'View all stores and their ratings.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:max-w-sm">
                                <Input
                                    placeholder="Search name, email, or address..."
                                    icon={Search}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            {activeTab === 'users' && (
                                <select
                                    className="h-10 rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Normal User">Normal User</option>
                                    <option value="Store Owner">Store Owner</option>
                                    <option value="System Administrator">Admin</option>
                                </select>
                            )}
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-white/5 text-xs uppercase text-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Address</th>
                                        {activeTab === 'users' ? (
                                            <>
                                                <th className="px-6 py-3">Role</th>
                                                <th className="px-6 py-3 text-right">Actions</th>
                                            </>
                                        ) : (
                                            <th className="px-6 py-3">Rating</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeTab === 'users' ? (
                                        filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                                    <td className="px-6 py-4">{user.email}</td>
                                                    <td className="px-6 py-4">{user.address || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === 'System Administrator' ? 'bg-purple-500/10 text-purple-400' :
                                                            user.role === 'Store Owner' ? 'bg-blue-500/10 text-blue-400' :
                                                                'bg-slate-500/10 text-slate-400'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center">No users found.</td>
                                            </tr>
                                        )
                                    ) : (
                                        filteredStores.length > 0 ? (
                                            filteredStores.map((store) => (
                                                <tr key={store.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-white">{store.name}</td>
                                                    <td className="px-6 py-4">{store.email}</td>
                                                    <td className="px-6 py-4">{store.address}</td>
                                                    <td className="px-6 py-4 text-amber-400 font-bold">
                                                        ★ {store.rating || 0}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-center">No stores found.</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add User Modal */}
            <Modal
                isOpen={showAddUser}
                onClose={() => setShowAddUser(false)}
                title="Add New User"
            >
                <form onSubmit={handleAddUser} className="space-y-4">
                    {formError && <div className="text-red-400 text-sm">{formError}</div>}
                    <Input
                        label="Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <Input
                        label="Address"
                        value={newUser.address}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Role</label>
                        <select
                            className="w-full rounded-md border border-white/10 bg-black/20 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="Normal User">Normal User</option>
                            <option value="Store Owner">Store Owner</option>
                            <option value="System Administrator">System Administrator</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowAddUser(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Create User</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
