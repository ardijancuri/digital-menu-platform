import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicAPI } from '../services/api';

const PublicMenuPage = () => {
    const { slug } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isBannerPaused, setIsBannerPaused] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, [slug]);

    useEffect(() => {
        if (menu) {
            // Load Google Fonts
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

    // Carousel Autoplay
    useEffect(() => {
        if (menu?.theme?.banner_images?.length > 1 && !isBannerPaused) {
            const timer = setInterval(() => {
                setCurrentBannerIndex(prev => (prev + 1) % menu.theme.banner_images.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [menu?.theme?.banner_images, isBannerPaused]);

    const handleBannerSwipe = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        const length = menu.theme.banner_images.length;

        if (isLeftSwipe) {
            setCurrentBannerIndex(prev => (prev + 1) % length);
        }
        if (isRightSwipe) {
            setCurrentBannerIndex(prev => (prev - 1 + length) % length);
        }
    };

    const fetchMenu = async () => {
        try {
            const response = await publicAPI.getMenu(slug);
            setMenu(response.data.menu);
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !menu) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Menu not found</p>
            </div>
        );
    }

    const { theme } = menu;
    const bannerImages = theme.banner_images || [];

    return (
        <div className="min-h-screen pb-20" style={{ backgroundColor: theme.background_color }}>
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
                {/* Header */}
                <header className="px-5 py-4">
                    <div className="flex items-center gap-4">
                        {menu.logo_url && (
                            <img
                                src={menu.logo_url}
                                alt="Logo"
                                className="w-16 h-16 rounded-full object-cover shadow-sm"
                            />
                        )}
                        <div>
                            <h1
                                className="text-2xl font-bold leading-tight"
                                style={{
                                    color: theme.primary_color,
                                    fontFamily: theme.business_name_font
                                }}
                            >
                                {menu.business_name}
                            </h1>

                        </div>
                    </div>
                </header>

                {/* Banner Carousel */}
                {bannerImages.length > 0 && (
                    <div
                        className="px-5 mb-8"
                        onMouseEnter={() => setIsBannerPaused(true)}
                        onMouseLeave={() => setIsBannerPaused(false)}
                        onTouchStart={(e) => {
                            setIsBannerPaused(true);
                            setTouchStart(e.targetTouches[0].clientX);
                        }}
                        onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                        onTouchEnd={() => {
                            setIsBannerPaused(false);
                            handleBannerSwipe();
                            setTouchStart(null);
                            setTouchEnd(null);
                        }}
                    >
                        <div className="relative rounded-2xl overflow-hidden aspect-[2/1] shadow-lg">
                            {bannerImages.map((img, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                                        }`}
                                >
                                    <img src={img} alt="Banner" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0"></div>
                                </div>
                            ))}

                            {/* Dots */}
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                                {bannerImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentBannerIndex(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Categories */}
                <main className="px-5 space-y-6">
                    {menu.categories.map((category, index) => {
                        const isExpanded = expandedCategories.has(category.id);
                        // Use theme for "Nearby Shop" or "Popular" section headers style as reference
                        // But here we display Categories

                        return (
                            <div key={category.id}>
                                <div
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex justify-between items-center mb-2 cursor-pointer"
                                >
                                <h2
                                    className="text-2xl font-bold"
                                        style={{
                                            color: theme.category_title_color,
                                            fontFamily: theme.category_font
                                        }}
                                    >
                                        {category.name}
                                    </h2>
                                <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 flex items-center gap-1.5">
                                        {isExpanded ? 'Hide' : 'See All'}
                                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-base`}></i>
                                    </span>
                                </div>

                                {isExpanded && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {category.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-gray-100 rounded-3xl overflow-hidden transition-shadow flex flex-col h-full"
                                            >
                                                {/* Image */}
                                                <div className="p-2 pb-0">
                                                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group">
                                                        {item.images && item.images.length > 0 ? (
                                                            item.images.length > 1 ? (
                                                                <div className="w-full h-full relative group">
                                                                    <div
                                                                        className="flex overflow-x-auto snap-x snap-mandatory h-full w-full hide-scrollbar cursor-grab active:cursor-grabbing"
                                                                        onMouseDown={(e) => {
                                                                            const slider = e.currentTarget;
                                                                            slider.style.scrollSnapType = 'none'; // Disable snap while dragging
                                                                            slider.dataset.isDown = 'true';
                                                                            slider.dataset.startX = e.pageX; // Use global pageX
                                                                            slider.dataset.scrollLeft = slider.scrollLeft;
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            const slider = e.currentTarget;
                                                                            slider.dataset.isDown = 'false';
                                                                            slider.style.scrollSnapType = 'x mandatory'; // Re-enable snap
                                                                        }}
                                                                        onMouseUp={(e) => {
                                                                            const slider = e.currentTarget;
                                                                            slider.dataset.isDown = 'false';
                                                                            slider.style.scrollSnapType = 'x mandatory'; // Re-enable snap
                                                                        }}
                                                                        onMouseMove={(e) => {
                                                                            const slider = e.currentTarget;
                                                                            if (slider.dataset.isDown !== 'true') return;
                                                                            e.preventDefault();
                                                                            const x = e.pageX;
                                                                            const walk = (x - parseFloat(slider.dataset.startX)) * 2; // Scroll-fast
                                                                            slider.scrollLeft = parseFloat(slider.dataset.scrollLeft) - walk;
                                                                        }}
                                                                    >
                                                                        {item.images.map((img, idx) => (
                                                                            <img
                                                                                key={idx}
                                                                                src={img}
                                                                                alt={`${item.name} ${idx + 1}`}
                                                                                className="snap-center min-w-full h-full object-cover pointer-events-none"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1.5">
                                                                        {item.images.map((_, idx) => (
                                                                            <div key={idx} className="w-2 h-2 rounded-full bg-white opacity-75 shadow-sm" />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={item.images[0]}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                <i className="fas fa-utensils text-2xl opacity-50"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 flex flex-col flex-1">
                                                    <h3
                                                        className="font-bold text-base mb-1 leading-tight line-clamp-2"
                                                        style={{
                                                            color: theme.product_name_font,
                                                            fontFamily: theme.product_name_font
                                                        }}
                                                    >
                                                        {item.name}
                                                    </h3>

                                                    <div className="mt-auto pt-2 flex items-center justify-between">
                                                        <span
                                                            className="font-bold text-lg"
                                                            style={{
                                                                color: theme.price_color,
                                                                fontFamily: theme.product_name_font
                                                            }}
                                                        >
                                                            {`${Math.round(parseFloat(item.price))} MKD`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {index < menu.categories.length - 1 && (
                                    <div className="border-b border-gray-200 my-6"></div>
                                )}
                            </div>
                        );
                    })}
                </main>
            </div>
            {/* Footer */}
            <footer className="mt-10 px-5 pb-8 text-center text-sm text-gray-500">
                <span>Developed by </span>
                <a
                    href="https://oninova.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                >
                    ONINOVA
                </a>
            </footer>
        </div>
    );
};

export default PublicMenuPage;
