import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ColorPicker from '../../components/ColorPicker';
import ImageUpload from '../../components/ImageUpload';

const SettingsPage = () => {
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'mk', label: 'Macedonian' },
        { code: 'sq', label: 'Albanian' },
        { code: 'tr', label: 'Turkish' },
    ];

    const { user } = useAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Generate menu URL
    const menuUrl = user?.slug ? `${window.location.origin}/menu/${user.slug}` : '';
    const qrCodeUrl = menuUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}` : '';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await userAPI.getSettings();
            const fetched = response.data.settings || {};
            setSettings({
                ...fetched,
                business_name: fetched.business_name || '',
                default_language: fetched.default_language || 'en',
            });
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleLogoUpload = async (file) => {
        setUploading(true);
        try {
            const response = await userAPI.uploadLogo(file);
            setSettings(prev => ({ ...prev, logo_url: response.data.logo_url }));
            alert('Logo uploaded successfully!');
        } catch (err) {
            alert('Failed to upload logo');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await userAPI.updateSettings({
                business_name: settings.business_name || '',
                description: settings.description,
                opening_hours: settings.opening_hours,
                default_language: settings.default_language || 'en',
            });
            alert('Settings saved successfully!');
        } catch (err) {
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
            </div>
        );
    }

    const handleDownloadQR = async () => {
        if (!qrCodeUrl) return;
        try {
            const response = await fetch(qrCodeUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch QR code');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `menu-qr-code-${user?.slug || 'menu'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Clean up after a short delay to ensure download starts
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error downloading QR code:', error);
            alert('Failed to download QR code. Please try again.');
        }
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Menu Settings</h2>
                    <p className="text-gray-600">Customize your menu's appearance and information</p>
                </div>
                <Button onClick={handleSave} variant="primary" loading={saving} className="sm:w-auto w-full">
                    <i className="fas fa-save mr-2"></i>
                    Save Settings
                </Button>
            </div>

            {/* Two Column Grid for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Menu Title */}
                    <div className="card-flat">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                            <i className="fas fa-heading text-blue-600"></i>
                            Menu Title
                        </h3>
                        <Input
                            label="Business Name *"
                            name="business_name"
                            value={settings.business_name || ''}
                            onChange={handleInputChange}
                            placeholder="Enter your business name"
                            required
                        />
                    </div>

                    {/* Logo Section */}
                    <div className="card-flat">
                        <h3 className="text-lg font-bold mb-3 text-gray-900 flex items-center gap-2">
                            <i className="fas fa-image text-blue-600"></i>
                            Business Logo
                        </h3>
                        <ImageUpload
                            onUpload={handleLogoUpload}
                            currentImage={settings.logo_url}
                            label="Upload your restaurant logo"
                        />
                        {uploading && (
                            <div className="mt-2 flex items-center gap-2 text-blue-600 text-sm">
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Uploading...</span>
                            </div>
                        )}
                    </div>

                    {/* Language Settings */}
                    <div className="card-flat">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                            <i className="fas fa-language text-blue-600"></i>
                            Language Settings
                        </h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Default Language *
                            </label>
                            <select
                                name="default_language"
                                value={settings.default_language || 'en'}
                                onChange={handleInputChange}
                                className="input"
                                required
                            >
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.label}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                                This will be the default language shown when visitors first open your menu.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Business Information */}
                    <div className="card-flat">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                            <i className="fas fa-info-circle text-blue-600"></i>
                            Business Information
                        </h3>
                        <div className="space-y-4">
                            <Input
                                label="Description"
                                name="description"
                                value={settings.description || ''}
                                onChange={handleInputChange}
                                placeholder="Tell customers about your business..."
                            />
                            <Input
                                label="Opening Hours"
                                name="opening_hours"
                                value={settings.opening_hours || ''}
                                onChange={handleInputChange}
                                placeholder="Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                            />
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="card-flat">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                            <i className="fas fa-qrcode text-blue-600"></i>
                            Menu QR Code
                        </h3>
                        {menuUrl ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Menu URL
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={menuUrl}
                                            readOnly
                                            className="input flex-1 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                try {
                                                    await navigator.clipboard.writeText(menuUrl);
                                                    alert('URL copied to clipboard!');
                                                } catch (err) {
                                                    // Fallback for older browsers
                                                    const textArea = document.createElement('textarea');
                                                    textArea.value = menuUrl;
                                                    textArea.style.position = 'fixed';
                                                    textArea.style.opacity = '0';
                                                    document.body.appendChild(textArea);
                                                    textArea.select();
                                                    try {
                                                        document.execCommand('copy');
                                                        alert('URL copied to clipboard!');
                                                    } catch (fallbackErr) {
                                                        alert('Failed to copy URL. Please copy manually.');
                                                    }
                                                    document.body.removeChild(textArea);
                                                }
                                            }}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            title="Copy URL"
                                        >
                                            <i className="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                                {qrCodeUrl && (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                                            <img
                                                src={qrCodeUrl}
                                                alt="Menu QR Code"
                                                className="w-48 h-48"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleDownloadQR}
                                            variant="primary"
                                            className="w-full"
                                        >
                                            <i className="fas fa-download mr-2"></i>
                                            Download QR Code
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                Menu URL will be available after your account is set up.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

