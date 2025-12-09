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
    const [activeTab, setActiveTab] = useState('style');

    const normalizeColor = (value, fallback) => {
        if (typeof value !== 'string') return fallback;
        const trimmed = value.trim();
        const isHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(trimmed);
        return isHex ? trimmed : fallback;
    };

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
                                onClick={() => setActiveTab('style')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'style'
                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="fas fa-swatchbook mr-2"></i>
                                Style
                            </button>
                            <button
                                onClick={() => setActiveTab('banners')}
                                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'banners'
                                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <i className="fas fa-images mr-2"></i>
                                Banners
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {activeTab === 'style' && (
                                <div className="space-y-5">
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

                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Colors</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <ColorPicker
                                                label="Primary (title & categories)"
                                                value={settings?.primary_color || '#1f2937'}
                                                onChange={(value) => handleColorChange('primary_color', value)}
                                                name="primary_color"
                                            />
                                            <ColorPicker
                                                label="Accent (tile & toggle bg)"
                                                value={settings?.accent_color || '#f3f4f6'}
                                                onChange={(value) => handleColorChange('accent_color', value)}
                                                name="accent_color"
                                            />
                                            <ColorPicker
                                                label="Hide/Show Text & Icon"
                                                value={settings?.category_icon_color || '#374151'}
                                                onChange={(value) => handleColorChange('category_icon_color', value)}
                                                name="category_icon_color"
                                            />
                                            <ColorPicker
                                                label="Background"
                                                value={settings?.background_color || '#ffffff'}
                                                onChange={(value) => handleColorChange('background_color', value)}
                                                name="background_color"
                                            />
                                            <ColorPicker
                                                label="Product Name"
                                                value={settings?.product_name_color || '#1f2937'}
                                                onChange={(value) => handleColorChange('product_name_color', value)}
                                                name="product_name_color"
                                            />
                                            <ColorPicker
                                                label="Price"
                                                value={settings?.price_color || '#3b82f6'}
                                                onChange={(value) => handleColorChange('price_color', value)}
                                                name="price_color"
                                            />
                                            <ColorPicker
                                                label="Breakline"
                                                value={normalizeColor(settings?.breakline_color, '#e5e7eb')}
                                                onChange={(value) => handleColorChange('breakline_color', value)}
                                                name="breakline_color"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'banners' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Carousel Images (Max 5)</h4>

                                    {/* Existing Banners */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {settings?.banner_images?.map((url, index) => (
                                            <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                                                <img
                                                    src={url}
                                                    alt={`Banner ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Delete this banner?')) {
                                                            setSaving(true);
                                                            try {
                                                                await userAPI.deleteBannerImage(url);
                                                                const updatedBanners = settings.banner_images.filter(img => img !== url);
                                                                setSettings({ ...settings, banner_images: updatedBanners });
                                                                setIframeKey(prev => prev + 1);
                                                            } catch (error) {
                                                                console.error(error);
                                                                alert('Failed to delete banner');
                                                            } finally {
                                                                setSaving(false);
                                                            }
                                                        }
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <i className="fas fa-times text-xs"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Upload New Banner */}
                                    {(!settings?.banner_images || settings.banner_images.length < 5) && (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors bg-gray-50">
                                            <input
                                                type="file"
                                                id="banner-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    setSaving(true);
                                                    try {
                                                        const response = await userAPI.uploadBannerImage(file);
                                                        const newUrl = response.data.imageUrl;
                                                        const currentBanners = settings.banner_images || [];
                                                        setSettings({
                                                            ...settings,
                                                            banner_images: [...currentBanners, newUrl]
                                                        });
                                                        setIframeKey(prev => prev + 1);
                                                    } catch (error) {
                                                        console.error(error);
                                                        alert('Failed to upload banner');
                                                    } finally {
                                                        setSaving(false);
                                                        e.target.value = ''; // Reset input
                                                    }
                                                }}
                                            />
                                            <label htmlFor="banner-upload" className="cursor-pointer">
                                                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                                <p className="text-sm text-gray-600 font-medium">Click to upload banner</p>
                                                <p className="text-xs text-gray-500 mt-1">Recommended: 16:9 ratio</p>
                                            </label>
                                        </div>
                                    )}

                                    {settings?.banner_images?.length >= 5 && (
                                        <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-200">
                                            <i className="fas fa-info-circle mr-1"></i>
                                            Maximum of 5 banner images reached.
                                        </div>
                                    )}
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
