import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const AdminUsers = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminAPI.getUsers();
            setUsers(response.data.users);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await adminAPI.toggleUserStatus(id);
            fetchUsers();
        } catch (err) {
            alert('Failed to toggle user status');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await adminAPI.deleteUser(id);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <div className="flex space-x-4">
                        <Button onClick={() => navigate('/admin/applications')} variant="secondary">
                            Applications
                        </Button>
                        <Button onClick={() => navigate('/admin/map-listings')} variant="secondary">
                            Map Listings
                        </Button>
                        <Button onClick={logout} variant="danger">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500">No users yet</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {users.map((user) => (
                            <div key={user.id} className="card">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-semibold">{user.business_name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.is_active ? 'Active' : 'Disabled'}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1 text-sm">
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Menu URL:</strong> /menu/{user.slug}</p>
                                            <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => handleToggle(user.id)}
                                            variant="secondary"
                                        >
                                            {user.is_active ? 'Disable' : 'Enable'}
                                        </Button>
                                        <Button onClick={() => handleDelete(user.id)} variant="danger">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
