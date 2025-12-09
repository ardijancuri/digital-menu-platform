import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const ApplyPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        business_name: '',
        business_type: 'Restaurant',
        owner_name: '',
        email: '',
        phone: '',
        slug: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'business_name') {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...submitData } = formData;
            await applicationAPI.submit(submitData);
            setSuccess(true);
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMessages = err.response.data.errors.map(e => e.msg).join(', ');
                setError(errorMessages);
            } else {
                setError(err.response?.data?.message || 'Failed to submit application');
            }
            console.error('Application error:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen gradient-bg-light flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-check text-4xl text-green-600"></i>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">Application Submitted!</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Thank you for applying! We'll review your application and get back to you within 24 hours.
                    </p>
                    <Link to="/">
                        <Button variant="primary">
                            <i className="fas fa-home mr-2"></i>
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen gradient-bg-light py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
                        <i className="fas fa-arrow-left"></i>
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="text-5xl font-bold mb-4 text-gray-900">Apply for Your Digital Menu</h1>
                    <p className="text-xl text-gray-600">Join hundreds of restaurants already using our platform</p>
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

                        {/* Business Information */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                                <i className="fas fa-store text-blue-600"></i>
                                Business Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Business Name"
                                    name="business_name"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., The Golden Spoon"
                                />

                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Business Type
                                    </label>
                                    <select
                                        name="business_type"
                                        value={formData.business_type}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    >
                                        <option value="Restaurant">Restaurant</option>
                                        <option value="Café">Café</option>
                                    </select>
                                </div>

                                <Input
                                    label="URL Slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="the-golden-spoon"
                                    required
                                />

                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <i className="fas fa-link mr-2"></i>
                                    <strong>Your menu will be available at:</strong> /menu/{formData.slug || 'your-slug'}
                                </p>
                            </div>
                        </div>

                        {/* Owner Information */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                                <i className="fas fa-user text-blue-600"></i>
                                Owner Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Owner Name"
                                    name="owner_name"
                                    value={formData.owner_name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                                <i className="fas fa-lock text-blue-600"></i>
                                Account Security
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 6 characters"
                                    required
                                />

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button type="submit" variant="primary" loading={loading} className="flex-1">
                                <i className="fas fa-paper-plane mr-2"></i>
                                Submit Application
                            </Button>
                            <Link to="/" className="flex-1">
                                <Button type="button" variant="secondary" className="w-full">
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyPage;
