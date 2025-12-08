import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.adminLogin(formData);
            if (response.data && response.data.token && response.data.user) {
                login(response.data.user, response.data.token);
                navigate('/admin/applications');
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
        <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6">
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Home</span>
                    </Link>
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-user-shield text-3xl text-white"></i>
                    </div>
                    <h1 className="text-4xl font-bold mb-2 text-white">Admin Portal</h1>
                    <p className="text-white/80">Manage applications and users</p>
                </div>

                <div className="glass rounded-2xl p-8">
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
                            label="Admin Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="admin@menuplatform.com"
                            required
                        />

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input pr-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter admin password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" loading={loading} className="w-full">
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            Access Admin Panel
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
