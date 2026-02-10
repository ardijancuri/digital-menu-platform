import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { businessTypes, getTypeConfig } from '../../utils/mapHelpers';
import Button from '../../components/Button';
import MapView from '../../components/map/MapView';
import LocationPicker from '../../components/map/LocationPicker';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const emptyForm = {
    business_name: '',
    business_type: 'restaurant',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    email: '',
    website_url: '',
    menu_slug: '',
    opening_hours: {},
    is_featured: false,
    is_active: false,
};

const AdminMapListings = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [saving, setSaving] = useState(false);
    const [unlinkedUsers, setUnlinkedUsers] = useState([]);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await adminAPI.getMapListings();
            setListings(response.data.listings);
        } catch (err) {
            console.error('Failed to fetch map listings:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnlinkedUsers = async () => {
        try {
            const response = await adminAPI.getUnlinkedPlatformUsers();
            setUnlinkedUsers(response.data.users);
        } catch (err) {
            console.error('Failed to fetch unlinked users:', err);
        }
    };

    const openCreateModal = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        fetchUnlinkedUsers();
        setShowModal(true);
    };

    const openEditModal = (listing) => {
        setEditingId(listing.id);
        setForm({
            business_name: listing.business_name || '',
            business_type: listing.business_type || 'restaurant',
            address: listing.address || '',
            latitude: listing.latitude || '',
            longitude: listing.longitude || '',
            phone: listing.phone || '',
            email: listing.email || '',
            website_url: listing.website_url || '',
            menu_slug: listing.menu_slug || '',
            opening_hours: listing.opening_hours || {},
            is_featured: listing.is_featured || false,
            is_active: listing.is_active || false,
        });
        setShowModal(true);
    };

    const handleImportUser = (userId) => {
        const user = unlinkedUsers.find(u => u.id === parseInt(userId));
        if (user) {
            setForm(prev => ({
                ...prev,
                business_name: user.business_name,
                email: user.email,
                menu_slug: user.slug,
            }));
        }
    };

    const handleLocationSelect = (lat, lng) => {
        setForm(prev => ({
            ...prev,
            latitude: lat.toFixed(7),
            longitude: lng.toFixed(7),
        }));
    };

    const handleHoursChange = (day, field, value) => {
        setForm(prev => ({
            ...prev,
            opening_hours: {
                ...prev.opening_hours,
                [day]: {
                    ...(prev.opening_hours[day] || {}),
                    [field]: value,
                },
            },
        }));
    };

    const handleDayClosed = (day, isClosed) => {
        setForm(prev => ({
            ...prev,
            opening_hours: {
                ...prev.opening_hours,
                [day]: isClosed ? null : { open: '09:00', close: '22:00' },
            },
        }));
    };

    const handleSave = async () => {
        if (!form.business_name.trim()) {
            alert('Business name is required.');
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                await adminAPI.updateMapListing(editingId, form);
            } else {
                await adminAPI.createMapListing(form);
            }
            setShowModal(false);
            fetchListings();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save listing.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this map listing?')) return;
        try {
            await adminAPI.deleteMapListing(id);
            fetchListings();
        } catch (err) {
            alert('Failed to delete listing.');
        }
    };

    const handleToggleActive = async (listing) => {
        try {
            await adminAPI.updateMapListing(listing.id, { ...listing, is_active: !listing.is_active });
            fetchListings();
        } catch (err) {
            alert('Failed to update listing.');
        }
    };

    const handleToggleFeatured = async (listing) => {
        try {
            await adminAPI.updateMapListing(listing.id, { ...listing, is_featured: !listing.is_featured });
            fetchListings();
        } catch (err) {
            alert('Failed to update listing.');
        }
    };

    const pickerIcon = L.divIcon({
        className: 'custom-map-marker-wrapper',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        html: `<div style="width:30px;height:30px;background:#3b82f6;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3)"><i class="fas fa-crosshairs" style="transform:rotate(45deg);color:white;font-size:13px"></i></div>`
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Map Listings</h1>
                    <div className="flex space-x-4">
                        <Button onClick={() => navigate('/admin/applications')} variant="secondary">
                            Applications
                        </Button>
                        <Button onClick={() => navigate('/admin/users')} variant="secondary">
                            Users
                        </Button>
                        <Button onClick={logout} variant="danger">
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">All Listings ({listings.length})</h2>
                    <Button onClick={openCreateModal} variant="primary">
                        + Add Listing
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500">No map listings yet</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {listings.map((listing) => {
                            const config = getTypeConfig(listing.business_type);
                            return (
                                <div key={listing.id} className="card">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <span
                                                    style={{
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        width: '32px', height: '32px', borderRadius: '50%', background: config.color, flexShrink: 0,
                                                    }}
                                                >
                                                    <i className={`fas ${config.icon}`} style={{ color: 'white', fontSize: '14px' }}></i>
                                                </span>
                                                <h3 className="text-lg font-semibold">{listing.business_name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.source === 'platform' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {listing.source === 'platform' ? 'Platform' : 'External'}
                                                </span>
                                                {listing.is_featured && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        <i className="fas fa-star" style={{ marginRight: '4px' }}></i>Featured
                                                    </span>
                                                )}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {listing.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <p><strong>Type:</strong> {config.label}</p>
                                                {listing.address && <p><strong>Address:</strong> {listing.address}</p>}
                                                {listing.latitude && listing.longitude && (
                                                    <p><strong>Coordinates:</strong> {listing.latitude}, {listing.longitude}</p>
                                                )}
                                                {listing.phone && <p><strong>Phone:</strong> {listing.phone}</p>}
                                                {listing.email && <p><strong>Email:</strong> {listing.email}</p>}
                                                {listing.menu_slug && <p><strong>Menu:</strong> /menu/{listing.menu_slug}</p>}
                                                {listing.business_name_user && (
                                                    <p><strong>Linked User:</strong> {listing.business_name_user}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleToggleActive(listing)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${listing.is_active ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                                            >
                                                {listing.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleToggleFeatured(listing)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${listing.is_featured ? 'bg-gray-50 text-gray-700 hover:bg-gray-100' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
                                            >
                                                {listing.is_featured ? 'Unfeature' : 'Feature'}
                                            </button>
                                            <Button onClick={() => openEditModal(listing)} variant="secondary">
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(listing.id)} variant="danger">
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', width: '90%', maxWidth: '700px',
                        maxHeight: '90vh', overflow: 'auto', padding: '24px',
                    }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">
                                {editingId ? 'Edit Listing' : 'Add Listing'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Import Platform User */}
                        {!editingId && unlinkedUsers.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <label className="block text-sm font-medium text-blue-800 mb-1">Import Platform User</label>
                                <select
                                    onChange={(e) => handleImportUser(e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a user to auto-fill...</option>
                                    {unlinkedUsers.map(u => (
                                        <option key={u.id} value={u.id}>{u.business_name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                <input
                                    type="text"
                                    value={form.business_name}
                                    onChange={(e) => setForm(prev => ({ ...prev, business_name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                <select
                                    value={form.business_type}
                                    onChange={(e) => setForm(prev => ({ ...prev, business_type: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    {businessTypes.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                <input
                                    type="url"
                                    value={form.website_url}
                                    onChange={(e) => setForm(prev => ({ ...prev, website_url: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Slug</label>
                                <input
                                    type="text"
                                    value={form.menu_slug}
                                    onChange={(e) => setForm(prev => ({ ...prev, menu_slug: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="e.g. my-restaurant"
                                />
                            </div>
                        </div>

                        {/* Location Picker */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location (click map to set pin)</label>
                            <div style={{ height: '250px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                <MapView
                                    center={
                                        form.latitude && form.longitude
                                            ? [parseFloat(form.latitude), parseFloat(form.longitude)]
                                            : [41.5, 21.4]
                                    }
                                    zoom={form.latitude ? 14 : 8}
                                >
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                    {form.latitude && form.longitude && (
                                        <Marker
                                            position={[parseFloat(form.latitude), parseFloat(form.longitude)]}
                                            icon={pickerIcon}
                                        />
                                    )}
                                </MapView>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.latitude}
                                        onChange={(e) => setForm(prev => ({ ...prev, latitude: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.longitude}
                                        onChange={(e) => setForm(prev => ({ ...prev, longitude: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Opening Hours */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
                            <div className="space-y-2">
                                {DAYS.map(day => {
                                    const hours = form.opening_hours[day];
                                    const isClosed = hours === null || hours === undefined;
                                    return (
                                        <div key={day} className="flex items-center gap-3">
                                            <span className="w-24 text-sm font-medium capitalize">{day}</span>
                                            <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isClosed}
                                                    onChange={(e) => handleDayClosed(day, e.target.checked)}
                                                />
                                                Closed
                                            </label>
                                            {!isClosed && (
                                                <>
                                                    <input
                                                        type="time"
                                                        value={hours?.open || '09:00'}
                                                        onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                    <span className="text-gray-400">-</span>
                                                    <input
                                                        type="time"
                                                        value={hours?.close || '22:00'}
                                                        onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="flex gap-6 mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                                />
                                <span className="text-sm font-medium">Active (visible on map)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => setForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                                />
                                <span className="text-sm font-medium">Featured</span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setShowModal(false)} variant="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} variant="primary" disabled={saving}>
                                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMapListings;
