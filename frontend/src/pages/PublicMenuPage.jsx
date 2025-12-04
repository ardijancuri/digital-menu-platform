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
            const businessNameFont = menu.theme.business_name_font || 'Montserrat';
            const categoryFont = menu.theme.category_font || 'Roboto Condensed';
            const productNameFont = menu.theme.product_name_font || 'Montserrat';
            const descriptionFont = menu.theme.description_font || 'Quicksand';

            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${businessNameFont.replace(/ /g, '+')}:wght@400;600;700&family=${categoryFont.replace(/ /g, '+')}:wght@400;600;700&family=${productNameFont.replace(/ /g, '+')}:wght@400;600;700&family=${descriptionFont.replace(/ /g, '+')}:wght@300;400;500;600&display=swap`;
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading menu...</p>
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

    const styles = {
        backgroundColor: menu.theme.background_color || '#ffffff',
        color: menu.theme.text_color || '#000000',
    };

    const primaryColor = menu.theme.primary_color || '#6366f1';
    const accentColor = menu.theme.accent_color || '#8b5cf6';
    const categoryBgColor = menu.theme.category_bg_color || '#f9fafb';
    const itemCardBgColor = menu.theme.item_card_bg_color || '#ffffff';
    const borderColor = menu.theme.border_color || '#e5e7eb';
    const headerBgColor = menu.theme.header_bg_color || '#ffffff';
    const categoryTitleColor = menu.theme.category_title_color || '#1f2937';
    const productNameColor = menu.theme.product_name_color || '#1f2937';
    const descriptionTextColor = menu.theme.description_text_color || '#6b7280';
    const priceColor = menu.theme.price_color || '#3b82f6';
    const categoryIconColor = menu.theme.category_icon_color || '#3b82f6';
    const businessNameFont = menu.theme.business_name_font || 'Montserrat';
    const categoryFont = menu.theme.category_font || 'Roboto Condensed';
    const productNameFont = menu.theme.product_name_font || 'Montserrat';
    const descriptionFont = menu.theme.description_font || 'Quicksand';

    return (
        <div className="min-h-screen" style={styles}>
            {/* Header */}
            <header className="border-b" style={{ borderColor: borderColor, backgroundColor: headerBgColor }}>
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center max-w-3xl mx-auto">
                        {menu.logo_url && (
                            <img
                                src={menu.logo_url}
                                alt={menu.business_name}
                                className="h-12 w-auto mx-auto object-contain"
                            />
                        )}
                        {!menu.logo_url && (
                            <h1
                                className="text-3xl font-bold"
                                style={{
                                    color: primaryColor,
                                    fontFamily: businessNameFont,
                                }}
                            >
                                {menu.business_name}
                            </h1>
                        )}

                    </div>
                </div>
            </header>

            {/* Menu Categories - Dropdown Style */}
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {menu.categories.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fas fa-utensils text-6xl opacity-20 mb-4"></i>
                        <p className="text-xl opacity-60" style={{ fontFamily: descriptionFont }}>
                            No categories available yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {menu.categories.map((category) => {
                            const isExpanded = expandedCategories.has(category.id);
                            const categoryItems = category.items || [];

                            return (
                                <div
                                    key={category.id}
                                    className="rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
                                    style={{
                                        backgroundColor: '#ffffff',
                                        border: `1px solid ${borderColor}`,
                                    }}
                                >
                                    {/* Category Header */}
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="w-full px-5 py-4 flex items-center justify-between transition-all duration-200"
                                        style={{
                                            backgroundColor: categoryBgColor,
                                        }}
                                    >
                                        <h2
                                            className="text-xl font-bold text-left"
                                            style={{
                                                color: categoryTitleColor,
                                                fontFamily: categoryFont,
                                            }}
                                        >
                                            {category.name}
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                                style={{
                                                    backgroundColor: `${accentColor}15`,
                                                    color: accentColor,
                                                    fontFamily: descriptionFont,
                                                }}
                                            >
                                                {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                                            </span>
                                            <i
                                                className={`fas fa-chevron-down text-lg transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                    }`}
                                                style={{ color: categoryIconColor }}
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
                                                <p className="text-gray-400" style={{ fontFamily: descriptionFont }}>
                                                    No items in this category yet
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="p-5 grid md:grid-cols-2 gap-5">
                                                {categoryItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                                        style={{
                                                            backgroundColor: itemCardBgColor,
                                                            border: `1px solid ${borderColor}`,
                                                        }}
                                                    >
                                                        {item.image_url && (
                                                            <div className="relative h-48 overflow-hidden">
                                                                <img
                                                                    src={item.image_url}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                                {item.tag && (
                                                                    <span
                                                                        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                                                                        style={{
                                                                            backgroundColor: accentColor,
                                                                            fontFamily: descriptionFont,
                                                                        }}
                                                                    >
                                                                        {item.tag}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="p-4">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h3
                                                                    className="text-lg font-bold flex-1"
                                                                    style={{
                                                                        color: primaryColor,
                                                                        fontFamily: productNameFont,
                                                                    }}
                                                                >
                                                                    {item.name}
                                                                </h3>
                                                                {!item.image_url && item.tag && (
                                                                    <span
                                                                        className="px-2 py-1 rounded-full text-xs font-bold text-white ml-2"
                                                                        style={{
                                                                            backgroundColor: accentColor,
                                                                            fontFamily: descriptionFont,
                                                                        }}
                                                                    >
                                                                        {item.tag}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {item.description && (
                                                                <p
                                                                    className="mb-3 leading-relaxed text-sm"
                                                                    style={{
                                                                        color: descriptionTextColor,
                                                                        fontFamily: descriptionFont
                                                                    }}
                                                                >
                                                                    {item.description}
                                                                </p>
                                                            )}
                                                            <div
                                                                className="text-xl font-bold"
                                                                style={{
                                                                    color: priceColor,
                                                                    fontFamily: productNameFont,
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
                    <p className="text-sm" style={{ fontFamily: descriptionFont }}>
                        <i className="fas fa-utensils mr-2"></i>
                        Powered by MenuPlatform
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicMenuPage;
