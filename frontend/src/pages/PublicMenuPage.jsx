import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicAPI } from '../services/api';

const PublicMenuPage = () => {
    const { slug } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    useEffect(() => {
        fetchMenu();
    }, [slug]);

    useEffect(() => {
        if (menu) {
            // Load Google Fonts dynamically
            const headingFont = menu.theme.heading_font || 'Playfair Display';
            const bodyFont = menu.theme.body_font || 'Poppins';

            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${headingFont.replace(' ', '+')}:wght@400;600;700&family=${bodyFont.replace(' ', '+')}:wght@300;400;500;600&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }
    }, [menu]);

    const fetchMenu = async () => {
        try {
            const response = await publicAPI.getMenu(slug);
            setMenu(response.data.menu);
            // Expand all categories by default
            const allCategoryIds = new Set(response.data.menu.categories.map(cat => cat.id));
            setExpandedCategories(allCategoryIds);
        } catch (err) {
            setError('Menu not found');
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (error || !menu) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <i className="fas fa-exclamation-circle text-6xl text-red-500 mb-4"></i>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
                    <p className="text-gray-600">The menu you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const styles = {
        backgroundColor: menu.theme.background_color || '#ffffff',
        color: menu.theme.text_color || '#000000',
    };

    const primaryColor = menu.theme.primary_color || '#6366f1';
    const accentColor = menu.theme.accent_color || '#8b5cf6';
    const headingFont = menu.theme.heading_font || 'Playfair Display';
    const bodyFont = menu.theme.body_font || 'Poppins';

    return (
        <div className="min-h-screen" style={styles}>
            {/* Header */}
            <header className="relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
                    }}
                ></div>
                <div className="container mx-auto px-4 py-12 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        {menu.logo_url && (
                            <img
                                src={menu.logo_url}
                                alt={menu.business_name}
                                className="h-20 w-auto mx-auto object-contain mb-6"
                            />
                        )}
                        {!menu.logo_url && (
                            <h1
                                className="text-6xl font-bold mb-4 tracking-tight"
                                style={{
                                    color: primaryColor,
                                    fontFamily: headingFont,
                                }}
                            >
                                {menu.business_name}
                            </h1>
                        )}
                        {menu.description && (
                            <p
                                className="text-xl mb-4 opacity-80 leading-relaxed"
                                style={{ fontFamily: bodyFont }}
                            >
                                {menu.description}
                            </p>
                        )}
                        {menu.opening_hours && (
                            <div
                                className="flex items-center justify-center gap-2 text-base opacity-70"
                                style={{ fontFamily: bodyFont }}
                            >
                                <i className="fas fa-clock"></i>
                                <span>{menu.opening_hours}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Menu Categories - Dropdown Style */}
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {menu.categories.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fas fa-utensils text-6xl opacity-20 mb-4"></i>
                        <p className="text-xl opacity-60" style={{ fontFamily: bodyFont }}>
                            No categories available yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {menu.categories.map((category) => {
                            const isExpanded = expandedCategories.has(category.id);
                            const categoryItems = category.items || [];

                            return (
                                <div
                                    key={category.id}
                                    className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                                    style={{
                                        backgroundColor: '#ffffff',
                                        border: `2px solid ${primaryColor}15`,
                                    }}
                                >
                                    {/* Category Header */}
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="w-full px-6 py-5 flex items-center justify-between transition-all duration-200 hover:bg-opacity-5"
                                        style={{
                                            backgroundColor: `${primaryColor}08`,
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md"
                                                style={{
                                                    background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                                                }}
                                            >
                                                <i className="fas fa-utensils text-lg"></i>
                                            </div>
                                            <h2
                                                className="text-3xl font-bold text-left"
                                                style={{
                                                    color: primaryColor,
                                                    fontFamily: headingFont,
                                                }}
                                            >
                                                {category.name}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-sm font-semibold px-3 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: `${accentColor}15`,
                                                    color: accentColor,
                                                    fontFamily: bodyFont,
                                                }}
                                            >
                                                {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                                            </span>
                                            <i
                                                className={`fas fa-chevron-down text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                    }`}
                                                style={{ color: primaryColor }}
                                            ></i>
                                        </div>
                                    </button>

                                    {/* Category Items */}
                                    <div
                                        className="transition-all duration-300 ease-in-out overflow-hidden"
                                        style={{
                                            maxHeight: isExpanded ? '5000px' : '0',
                                            opacity: isExpanded ? 1 : 0,
                                        }}
                                    >
                                        {categoryItems.length === 0 ? (
                                            <div className="px-6 py-12 text-center">
                                                <p className="text-gray-400" style={{ fontFamily: bodyFont }}>
                                                    No items in this category yet
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-6 grid md:grid-cols-2 gap-6">
                                                {categoryItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                                        style={{
                                                            border: `1px solid ${primaryColor}10`,
                                                        }}
                                                    >
                                                        {item.image_url && (
                                                            <div className="relative h-48 overflow-hidden">
                                                                <img
                                                                    src={item.image_url}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                                />
                                                                <div
                                                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                                                    style={{
                                                                        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                                                                    }}
                                                                ></div>
                                                                {item.tag && (
                                                                    <span
                                                                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                                                                        style={{
                                                                            backgroundColor: accentColor,
                                                                            fontFamily: bodyFont,
                                                                        }}
                                                                    >
                                                                        {item.tag}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="p-5">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h3
                                                                    className="text-xl font-bold flex-1"
                                                                    style={{
                                                                        color: primaryColor,
                                                                        fontFamily: headingFont,
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </h3>
                                                                {!item.image_url && item.tag && (
                                                                    <span
                                                                        className="px-2 py-1 rounded-full text-xs font-bold text-white ml-2"
                                                                        style={{
                                                                            backgroundColor: accentColor,
                                                                            fontFamily: bodyFont,
                                                                        }}
                                                                    >
                                                                        {item.tag}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {item.description && (
                                                                <p
                                                                    className="text-gray-600 mb-3 leading-relaxed text-sm"
                                                                    style={{ fontFamily: bodyFont }}
                                                                >
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                            <div
                                                                className="text-2xl font-bold"
                                                                style={{
                                                                    color: accentColor,
                                                                    fontFamily: bodyFont,
                                                                }}
                                                            >
                                                                ${parseFloat(item.price).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t mt-20 py-8" style={{ borderColor: `${primaryColor}20` }}>
                <div className="container mx-auto px-4 text-center opacity-60">
                    <p className="text-sm" style={{ fontFamily: bodyFont }}>
                        <i className="fas fa-utensils mr-2"></i>
                        Powered by MenuPlatform
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicMenuPage;

