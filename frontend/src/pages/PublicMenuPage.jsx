import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicAPI } from '../services/api';

const PublicMenuPage = () => {
    const { slug } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, [slug]);

    const fetchMenu = async () => {
        try {
            const response = await publicAPI.getMenu(slug);
            setMenu(response.data.menu);
            if (response.data.menu.categories.length > 0) {
                setSelectedCategory(response.data.menu.categories[0].id);
            }
        } catch (err) {
            setError('Menu not found');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (error || !menu) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
                    <p className="text-gray-600">The menu you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const filteredItems = selectedCategory
        ? menu.categories.find(c => c.id === selectedCategory)?.items || []
        : menu.categories.reduce((acc, cat) => [...acc, ...cat.items], []);

    const styles = {
        backgroundColor: menu.theme.background_color || '#ffffff',
        color: menu.theme.text_color || '#000000',
    };

    const primaryColor = menu.theme.primary_color || '#6366f1';
    const accentColor = menu.theme.accent_color || '#8b5cf6';

    return (
        <div className="min-h-screen" style={styles}>
            {/* Header */}
            <header className="border-b" style={{ borderColor: `${primaryColor}20` }}>
                <div className="container mx-auto p-4">
                    <div className="text-center">
                        {menu.logo_url && (
                            <img
                                src={menu.logo_url}
                                alt={menu.business_name}
                                className="h-14 w-auto mx-auto object-contain"
                            />
                        )}
                        {!menu.logo_url && (
                            <h1 className="text-5xl font-bold mb-3" style={{ color: primaryColor }}>
                                {menu.business_name}
                            </h1>
                        )}
                        {menu.description && (
                            <p className="text-xl mb-2 opacity-80">{menu.description}</p>
                        )}
                        {menu.opening_hours && (
                            <div className="flex items-center justify-center gap-2 text-sm opacity-70">
                                <i className="fas fa-clock"></i>
                                <span>{menu.opening_hours}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Category Navigation */}
            {menu.categories.length > 0 && (
                <nav className="sticky top-0 z-10 bg-white shadow-md">
                    <div className="container mx-auto px-4">
                        <div className="flex overflow-x-auto gap-2 py-4">
                            {menu.categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className="px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-200"
                                    style={{
                                        backgroundColor: selectedCategory === category.id ? primaryColor : 'transparent',
                                        color: selectedCategory === category.id ? '#ffffff' : primaryColor,
                                        border: `2px solid ${primaryColor}`,
                                    }}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </nav>
            )}

            {/* Menu Items */}
            <main className="container mx-auto px-4 py-12">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fas fa-utensils text-6xl opacity-20 mb-4"></i>
                        <p className="text-xl opacity-60">No items in this category yet</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {item.image_url && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {item.tag && (
                                            <span
                                                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                                                style={{ backgroundColor: accentColor }}
                                            >
                                                {item.tag}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-2xl font-bold" style={{ color: primaryColor }}>
                                            {item.name}
                                        </h3>
                                        {!item.image_url && item.tag && (
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                                                style={{ backgroundColor: accentColor }}
                                            >
                                                {item.tag}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                                    )}
                                    <div className="text-3xl font-bold" style={{ color: accentColor }}>
                                        ${parseFloat(item.price).toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t mt-20 py-8" style={{ borderColor: `${primaryColor}20` }}>
                <div className="container mx-auto px-4 text-center opacity-60">
                    <p className="text-sm">
                        <i className="fas fa-utensils mr-2"></i>
                        Powered by MenuPlatform
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicMenuPage;
