import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getTypeConfig } from '../../utils/mapHelpers';
import Button from '../../components/Button';

const normalizeDateInputValue = (value) => {
    if (!value) {
        return '';
    }

    if (typeof value === 'string') {
        return value.slice(0, 10);
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
};

const AdminApplications = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [applications, setApplications] = useState([]);
    const [paymentDrafts, setPaymentDrafts] = useState({});
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [savingPaymentId, setSavingPaymentId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [filter]);

    const fetchApplications = async () => {
        try {
            const response = await adminAPI.getApplications(filter);
            setApplications(response.data.applications);
            setPaymentDrafts(
                Object.fromEntries(
                    response.data.applications.map((app) => [
                        app.id,
                        {
                            last_payment_date: normalizeDateInputValue(app.last_payment_date),
                            paid_months: app.paid_months?.toString() || '',
                        }
                    ])
                )
            );
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('Approve this application?')) return;

        try {
            await adminAPI.approveApplication(id);
            fetchApplications();
        } catch (err) {
            alert('Failed to approve application');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this application?')) return;

        try {
            await adminAPI.rejectApplication(id);
            fetchApplications();
        } catch (err) {
            alert('Failed to reject application');
        }
    };

    const handlePaymentDraftChange = (id, field, value) => {
        setPaymentDrafts((prev) => ({
            ...prev,
            [id]: {
                ...(prev[id] || { last_payment_date: '', paid_months: '' }),
                [field]: value,
            },
        }));
    };

    const handleSavePayment = async (id) => {
        const draft = paymentDrafts[id] || { last_payment_date: '', paid_months: '' };

        try {
            setSavingPaymentId(id);
            await adminAPI.updateApplicationPayment(id, {
                last_payment_date: draft.last_payment_date || null,
                paid_months: draft.paid_months === '' ? null : Number(draft.paid_months),
            });
            await fetchApplications();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update payment details');
        } finally {
            setSavingPaymentId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <div className="flex space-x-4">
                        <Button onClick={() => navigate('/admin/users')} variant="secondary">
                            Users
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
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Applications</h2>
                    <div className="flex space-x-2">
                        {['pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize ${filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500">No {filter} applications</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((app) => {
                            const typeConfig = getTypeConfig(app.business_type);
                            const paymentDraft = paymentDrafts[app.id] || { last_payment_date: '', paid_months: '' };

                            return (
                                <div key={app.id} className="card">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold">{app.business_name}</h3>
                                                <p className="text-sm text-gray-600">{typeConfig.label}</p>
                                                <div className="mt-2 space-y-1 text-sm">
                                                    <p><strong>Owner:</strong> {app.owner_name}</p>
                                                    <p><strong>Email:</strong> {app.email}</p>
                                                    <p><strong>Phone:</strong> {app.phone}</p>
                                                    <p><strong>Slug:</strong> /menu/{app.slug}</p>
                                                    <p><strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {app.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <Button onClick={() => handleApprove(app.id)} variant="primary">
                                                        Approve
                                                    </Button>
                                                    <Button onClick={() => handleReject(app.id)} variant="danger">
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                            {app.status !== 'pending' && (
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            )}
                                        </div>

                                        {app.status === 'approved' && (
                                            <div className="border-t border-gray-200 pt-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Tracking</h4>
                                                <div className="grid md:grid-cols-3 gap-3 items-end">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Last Payment Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={paymentDraft.last_payment_date}
                                                            onChange={(e) => handlePaymentDraftChange(app.id, 'last_payment_date', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                                            Paid Months
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={paymentDraft.paid_months}
                                                            onChange={(e) => handlePaymentDraftChange(app.id, 'paid_months', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                            placeholder="e.g. 3"
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={() => handleSavePayment(app.id)}
                                                        variant="primary"
                                                        disabled={savingPaymentId === app.id}
                                                    >
                                                        {savingPaymentId === app.id ? 'Saving...' : 'Save Payment'}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminApplications;
