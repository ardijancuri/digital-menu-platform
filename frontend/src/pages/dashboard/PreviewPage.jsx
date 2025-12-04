import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import ColorPicker from '../../components/ColorPicker';

const FONT_OPTIONS = [
    'Roboto Condensed',
    'Montserrat',
    'Quicksand',
    'Merriweather Sans'
];

const PreviewPage = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);
    const [activeTab, setActiveTab] = useState('fonts');

    useEffect(() => {
        fetchSettings();

        // Add CSS to hide scrollbar
        const style = document.createElement('style');
        style.textContent = `
            iframe {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            iframe::-webkit-scrollbar {
                display: none;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await userAPI.getSettings();
            setSettings(response.data.settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFontChange = async (fontType, fontValue) => {
        setSaving(true);
        try {
            const updatedSettings = {
                ...settings,
                [fontType]: fontValue
            };

            await userAPI.updateSettings(updatedSettings);
            setSettings(updatedSettings);
            setIframeKey(prev => prev + 1);
        } catch (error) {
            console.error('Error updating font:', error);
            alert('Failed to update font. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleColorChange = async (colorField, colorValue) => {
        setSaving(true);
        try {
            const updatedSettings = {
                ...settings,
                [colorField]: colorValue
            };

            await userAPI.updateSettings(updatedSettings);
            setSettings(updatedSettings);
            setIframeKey(prev => prev + 1);
        } catch (error) {
            console.error('Error updating color:', error);
            alert('Failed to update color. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-6">Menu Preview</h2>
                <div className="card">
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-8rem)]">
            <h2 className="text-2xl font-bold mb-4">Menu Preview & Customization</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100%-3rem)]">
                {/* Customization Panel */}
                <div className="flex flex-col h-full">
                    <div className="card p-0 flex-1 flex flex-col overflow-hidden">
                        {/* Tabs */}
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab('fonts')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'fonts'
                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="fas fa-font mr-2"></i>
                                Fonts
                            </button>
                            <button
                                onClick={() => setActiveTab('colors')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'colors'
                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="fas fa-palette mr-2"></i>
                                Colors
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTab === 'fonts' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Business Name
                                        </label>
                                        <select
                                            value={settings?.business_name_font || 'Montserrat'}
                                            onChange={(e) => handleFontChange('business_name_font', e.target.value)}
                                            disabled={saving}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            style={{ fontFamily: settings?.business_name_font || 'Montserrat' }}
                                        >
                                            {FONT_OPTIONS.map(font => (
                                                <option key={font} value={font} style={{ fontFamily: font }}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Categories
                                        </label>
                                        <select
                                            value={settings?.category_font || 'Roboto Condensed'}
                                            onChange={(e) => handleFontChange('category_font', e.target.value)}
                                            disabled={saving}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            style={{ fontFamily: settings?.category_font || 'Roboto Condensed' }}
                                        >
                                            {FONT_OPTIONS.map(font => (
                                                <option key={font} value={font} style={{ fontFamily: font }}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Product Names
                                        </label>
                                        <select
                                            value={settings?.product_name_font || 'Montserrat'}
                                            onChange={(e) => handleFontChange('product_name_font', e.target.value)}
                                            disabled={saving}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            style={{ fontFamily: settings?.product_name_font || 'Montserrat' }}
                                        >
                                            {FONT_OPTIONS.map(font => (
                                                <option key={font} value={font} style={{ fontFamily: font }}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Descriptions
                                        </label>
                                        <select
                                            value={settings?.description_font || 'Quicksand'}
                                            onChange={(e) => handleFontChange('description_font', e.target.value)}
                                            disabled={saving}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            style={{ fontFamily: settings?.description_font || 'Quicksand' }}
                                        >
                                            {FONT_OPTIONS.map(font => (
                                                <option key={font} value={font} style={{ fontFamily: font }}>
                                                    {font}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'colors' && (
                                <div className="space-y-4">
                                    {/* Brand Colors */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Brand Colors</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            <ColorPicker
                                                label="Primary"
                                                value={settings?.primary_color || '#1f2937'}
                                                onChange={(value) => handleColorChange('primary_color', value)}
                                                name="primary_color"
                                            />
                                            <ColorPicker
                                                label="Accent"
                                                value={settings?.accent_color || '#3b82f6'}
                                                onChange={(value) => handleColorChange('accent_color', value)}
                                                name="accent_color"
                                            />
                                            <ColorPicker
                                                label="Border"
                                                value={settings?.border_color || '#e5e7eb'}
                                                onChange={(value) => handleColorChange('border_color', value)}
                                                name="border_color"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200"></div>

                                    {/* Background Colors */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Backgrounds</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <ColorPicker
                                                label="Header"
                                                value={settings?.header_bg_color || '#ffffff'}
                                                onChange={(value) => handleColorChange('header_bg_color', value)}
                                                name="header_bg_color"
                                            />
                                            <ColorPicker
                                                label="Category"
                                                value={settings?.category_bg_color || '#f9fafb'}
                                                onChange={(value) => handleColorChange('category_bg_color', value)}
                                                name="category_bg_color"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200"></div>

                                    {/* Text Colors */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Text Colors</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            <ColorPicker
                                                label="Body Text"
                                                value={settings?.text_color || '#111827'}
                                                onChange={(value) => handleColorChange('text_color', value)}
                                                name="text_color"
                                            />
                                            <ColorPicker
                                                label="Category Title"
                                                value={settings?.category_title_color || '#1f2937'}
                                                onChange={(value) => handleColorChange('category_title_color', value)}
                                                name="category_title_color"
                                            />
                                            <ColorPicker
                                                label="Product Name"
                                                value={settings?.product_name_color || '#1f2937'}
                                                onChange={(value) => handleColorChange('product_name_color', value)}
                                                name="product_name_color"
                                            />
                                            <ColorPicker
                                                label="Description"
                                                value={settings?.description_text_color || '#6b7280'}
                                                onChange={(value) => handleColorChange('description_text_color', value)}
                                                name="description_text_color"
                                            />
                                            <ColorPicker
                                                label="Price"
                                                value={settings?.price_color || '#3b82f6'}
                                                onChange={(value) => handleColorChange('price_color', value)}
                                                name="price_color"
                                            />
                                            <ColorPicker
                                                label="Icon"
                                                value={settings?.category_icon_color || '#3b82f6'}
                                                onChange={(value) => handleColorChange('category_icon_color', value)}
                                                name="category_icon_color"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {saving && (
                                <div className="mt-4 text-sm text-blue-600 flex items-center gap-2">
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Updating...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="flex flex-col h-full">
                    <div className="card flex-1 flex flex-col overflow-hidden">
                        <div className="mb-3">
                            <p className="text-xs text-gray-600 mb-1">
                                Public URL:
                            </p>
                            <a
                                href={`/menu/${user?.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center gap-2"
                            >
                                /menu/{user?.slug}
                                <i className="fas fa-external-link-alt text-xs"></i>
                            </a>
                        </div>

                        {/* Mobile Preview */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative" style={{ width: '375px', maxHeight: '100%' }}>
                                {/* Mobile Device Frame */}
                                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                                    {/* Notch */}
                                    <div className="bg-black h-6 rounded-t-[2.5rem] flex items-center justify-center mb-1">
                                        <div className="bg-gray-900 w-32 h-4 rounded-full"></div>
                                    </div>

                                    {/* Screen */}
                                    <div
                                        className="bg-white rounded-[2rem] overflow-hidden"
                                        style={{ height: '600px' }}
                                    >
                                        <iframe
                                            key={iframeKey}
                                            src={`/menu/${user?.slug}`}
                                            className="w-full h-full"
                                            title="Mobile Menu Preview"
                                            style={{ overflow: 'hidden' }}
                                        />
                                    </div>

                                    {/* Home Indicator */}
                                    <div className="flex justify-center mt-2">
                                        <div className="bg-gray-700 w-32 h-1 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Device Label */}
                                <div className="text-center mt-3">
                                    <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                                        <i className="fas fa-mobile-alt"></i>
                                        Mobile Preview
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewPage;
