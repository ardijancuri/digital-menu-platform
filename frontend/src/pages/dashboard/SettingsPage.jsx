import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
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

    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Menu Settings</h2>
                <p className="text-gray-600">Customize your menu's appearance and information</p>
            </div>

            {/* Menu Title */}
            <div className="card-flat mb-6">
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
            <div className="card-flat mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <i className="fas fa-image text-blue-600"></i>
                    Business Logo
                </h3>
                <ImageUpload
                    onUpload={handleLogoUpload}
                    currentImage={settings.logo_url}
                    label="Upload your restaurant logo"
                />
                {uploading && (
                    <div className="mt-3 flex items-center gap-2 text-blue-600">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Uploading...</span>
                    </div>
                )}
            </div>

            {/* Language Settings */}
            <div className="card-flat mb-6">
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

            {/* Business Information */}
            <div className="card-flat mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-600"></i>
                    Business Information
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={settings.description || ''}
                            onChange={handleInputChange}
                            className="input"
                            rows="3"
                            placeholder="Tell customers about your business..."
                        />
                    </div>
                    <Input
                        label="Opening Hours"
                        name="opening_hours"
                        value={settings.opening_hours || ''}
                        onChange={handleInputChange}
                        placeholder="Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                    />
                </div>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} variant="primary" loading={saving} className="w-full">
                <i className="fas fa-save mr-2"></i>
                Save Settings
            </Button>
        </div>
    );
};

export default SettingsPage;

