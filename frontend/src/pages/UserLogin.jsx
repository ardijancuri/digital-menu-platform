import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const UserLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.userLogin(formData);
            if (response.data && response.data.token && response.data.user) {
                login(response.data.user, response.data.token);
                navigate('/dashboard');
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-bg-light flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Home</span>
                    </Link>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-utensils text-3xl text-white"></i>
                    </div>
                    <h1 className="text-4xl font-bold mb-2 text-gray-900">Restaurant Login</h1>
                    <p className="text-gray-600">Access your menu dashboard</p>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <div className="flex items-center">
                                    <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter your password"
                            required
                        />

                        <Button type="submit" variant="primary" loading={loading} className="w-full mb-4">
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            Sign In to Dashboard
                        </Button>

                        <div className="text-center space-y-3">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/apply" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Apply here
                                </Link>
                            </p>
                            <div className="pt-4 border-t border-gray-200">
                                <Link to="/admin/login" className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2">
                                    <i className="fas fa-user-shield"></i>
                                    Admin Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
