import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { publicAPI } from '../services/api';
import Modal from '../components/Modal';
import RightUpArrowIcon from '../assets/right up arrow.svg';

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
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const [language, setLanguage] = useState('en');
    const languages = [
        { code: 'en', label: 'English (UK)', flagUrl: 'https://flagcdn.com/gb.svg' },
        { code: 'mk', label: 'Macedonian', flagUrl: 'https://flagcdn.com/mk.svg' },
        { code: 'sq', label: 'Albanian', flagUrl: 'https://flagcdn.com/al.svg' },
        { code: 'tr', label: 'Turkish', flagUrl: 'https://flagcdn.com/tr.svg' }
    ];
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    const languageMenuRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, [slug]);

    // Initialize language from URL or default
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const langParam = params.get('lang');
        
        // If language is specified in URL, use it
        if (langParam) {
            const found = languages.find(l => l.code === langParam);
            if (found) {
                setSelectedLanguage(found);
                setLanguage(found.code);
                return;
            }
        }
        
        // Otherwise, wait for menu to load to get default language
        if (menu) {
            const defaultLang = menu.default_language || 'en';
            const found = languages.find(l => l.code === defaultLang) || languages[0];
            setSelectedLanguage(found);
            setLanguage(found.code);
        }
    }, [slug, menu]);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
                setIsLanguageMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            const fetchedMenu = response.data.menu;
            setMenu(fetchedMenu);
            // Default to first category open if it exists
            const firstCategoryId = fetchedMenu?.categories?.[0]?.id;
            setExpandedCategories(firstCategoryId ? new Set([firstCategoryId]) : new Set());
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

    const handleLanguageChange = (lang) => {
        setSelectedLanguage(lang);
        setLanguage(lang.code);
        setIsLanguageMenuOpen(false);
        const params = new URLSearchParams(window.location.search);
        if (lang.code === 'en') {
            params.delete('lang');
        } else {
            params.set('lang', lang.code);
        }
        const qs = params.toString();
        const newUrl = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
        window.history.replaceState({}, '', newUrl);
    };

    const getLocalizedText = (entity, field) => {
        // First, try the requested language explicitly
        if (entity?.translations?.[language]?.[field]) return entity.translations[language][field];
        if (entity?.[`${field}_${language}`]) return entity[`${field}_${language}`];
        
        // Always fallback to English (never use other languages as fallback)
        if (language !== 'en') {
            // Try explicit English translations
            if (entity?.translations?.en?.[field]) return entity.translations.en[field];
            if (entity?.[`${field}_en`]) return entity[`${field}_en`];
            
            // Try base field as English (check if it's not Macedonian)
            if (entity[field]) {
                // If name_mk exists and equals name, then name is Macedonian, don't use it
                if (entity[`${field}_mk`] && entity[field] === entity[`${field}_mk`]) {
                    return ''; // Don't use Macedonian as fallback
                }
                // Base field is likely English
                return entity[field];
            }
            return '';
        }
        
        // For English specifically, check if base field is actually Macedonian
        if (language === 'en') {
            // Check if base field is actually Macedonian (if name_mk exists and equals name)
            if (entity[`${field}_mk`] && entity[field] === entity[`${field}_mk`]) {
                // Base field is Macedonian, don't use it for English
                return '';
            }
            // Base field is likely English (different from Macedonian or no Macedonian exists)
            return entity?.[field] || '';
        }
        
        return '';
    };

    const getProductDescription = (product) => {
        if (!product) return '';
        
        // Try localized description first
        const localized = getLocalizedText(product, 'description');
        if (localized) return localized;
        
        // Fallback to direct field access
        if (product.description) return product.description;
        if (product[`description_${language}`]) return product[`description_${language}`];
        if (product.description_en) return product.description_en;
        if (product.description_mk) return product.description_mk;
        if (product.description_sq) return product.description_sq;
        if (product.description_tr) return product.description_tr;
        
        return '';
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
                <header className="px-5 py-6">
                    <div className="flex items-center justify-between gap-4">
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
                                {menu.description && (
                                    <p
                                        className="text-sm leading-tight"
                                        style={{
                                            color: theme.description_text_color || theme.text_color || '#6b7280',
                                            fontFamily: theme.description_font
                                        }}
                                    >
                                        {menu.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div 
                            className="relative z-50"
                            ref={languageMenuRef}
                        >
                            <div 
                                className={isLanguageMenuOpen ? 'rounded-t-full' : 'rounded-full'}
                                style={{ 
                                    border: `1px solid ${/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(theme.breakline_color || '')
                                        ? theme.breakline_color
                                        : '#e5e7eb'
                                    }`,
                                    borderBottom: isLanguageMenuOpen ? 'none' : `1px solid ${/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(theme.breakline_color || '')
                                        ? theme.breakline_color
                                        : '#e5e7eb'
                                    }`,
                                    backgroundColor: theme.background_color,
                                    padding: '4px',
                                    position: 'relative',
                                    display: 'inline-block',
                                    zIndex: isLanguageMenuOpen ? 50 : 50,
                                    borderBottomLeftRadius: isLanguageMenuOpen ? '0' : '9999px',
                                    borderBottomRightRadius: isLanguageMenuOpen ? '0' : '9999px'
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setIsLanguageMenuOpen(prev => !prev)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-105 focus:outline-none relative z-10"
                                    style={{ backgroundColor: theme.background_color }}
                                    aria-haspopup="true"
                                    aria-expanded={isLanguageMenuOpen}
                                    aria-label={`Change language (current: ${selectedLanguage.label})`}
                                >
                                    <img
                                        src={selectedLanguage.flagUrl}
                                        alt={selectedLanguage.label}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            </div>

                            <div
                                className={`absolute right-0 top-12 z-10 py-1 px-1 flex flex-col gap-1 items-end rounded-b-full transition-all duration-200 ease-out origin-top-right transform ${isLanguageMenuOpen
                                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                                    : '-translate-y-3 opacity-0 pointer-events-none'
                                }`}
                                style={{ 
                                    backgroundColor: theme.background_color,
                                    border: `1px solid ${/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(theme.breakline_color || '')
                                        ? theme.breakline_color
                                        : '#e5e7eb'
                                    }`,
                                    borderTop: 'none',
                                    borderTopLeftRadius: '0',
                                    borderTopRightRadius: '0',
                                    marginTop: '-1px'
                                }}
                                aria-hidden={!isLanguageMenuOpen}
                            >
                                {languages
                                    .filter(lang => lang.code !== selectedLanguage.code)
                                    .map(lang => (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-transform focus:outline-none"
                                        onClick={() => handleLanguageChange(lang)}
                                        aria-label={lang.label}
                                        style={{ backgroundColor: theme.background_color }}
                                    >
                                        <img
                                            src={lang.flagUrl}
                                            alt={lang.label}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Banner Carousel */}
                {bannerImages.length > 0 && (
                    <div
                        className="px-5 mb-10"
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
                        <div className="relative rounded-[30px] overflow-hidden aspect-[2/1]">
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
                                    className="flex justify-between items-center mb-4 cursor-pointer"
                                >
                                    <h2
                                        className="text-2xl font-bold"
                                        style={{
                                            color: theme.primary_color,
                                            fontFamily: theme.category_font
                                        }}
                                    >
                                        {getLocalizedText(category, 'name')}
                                    </h2>
                                    <span
                                        className="text-sm font-medium px-2.5 py-2 rounded-full flex items-center"
                                        style={{
                                            backgroundColor: theme.accent_color || '#f3f4f6',
                                            color: theme.category_icon_color || '#374151'
                                        }}
                                        aria-label={isExpanded ? 'Hide category' : 'See category items'}
                                        title={isExpanded ? 'Hide category' : 'See category items'}
                                    >
                                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-base`}></i>
                                        <span className="sr-only">{isExpanded ? 'Hide' : 'See All'}</span>
                                    </span>
                                </div>

                                {isExpanded && (
                                    <div className="grid grid-cols-2 gap-4">
                                        {category.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-3xl overflow-hidden transition-shadow flex flex-col h-full"
                                                style={{ backgroundColor: theme.accent_color || '#f3f4f6' }}
                                            >
                                                {/* Image */}
                                                <div className="p-2 pb-0">
                                                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 group">
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
                                                <div className="px-2 py-2 pl-4 flex items-center gap-2 flex-1">
                                                    {/* Left Column: Title and Price */}
                                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                                        <h3
                                                            className="font-bold text-base leading-tight line-clamp-2"
                                                            style={{
                                                                color: theme.product_name_color || theme.product_name_font,
                                                                fontFamily: theme.product_name_font
                                                            }}
                                                        >
                                                            {getLocalizedText(item, 'name')}
                                                        </h3>
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

                                                    {/* Right Column: Button */}
                                                    <div className="flex-shrink-0 flex items-center">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedProduct(item);
                                                                setIsProductModalOpen(true);
                                                            }}
                                                            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80 focus:outline-none"
                                                            style={{
                                                                backgroundColor: theme.primary_color || '#1f2937',
                                                                color: '#ffffff'
                                                            }}
                                                            aria-label="View product details"
                                                        >
                                                            <img 
                                                                src={RightUpArrowIcon} 
                                                                alt="View details" 
                                                                className="w-3.5 h-3.5"
                                                                style={{ filter: 'brightness(0) invert(1)' }}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {index < menu.categories.length - 1 && (
                                    <div
                                        className="border-b my-6"
                                        style={{
                                            borderColor: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(theme.breakline_color || '')
                                                ? theme.breakline_color
                                                : '#e5e7eb'
                                        }}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </main>
            </div>
            {/* Footer */}
            <footer className="mt-10 px-5 pb-8 text-center text-sm text-gray-500">
                <span className="text-black">Developed by </span>
                <a
                    href="https://onipos.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-black hover:underline"
                >
                    ONIPOS
                </a>
            </footer>

            {/* Product Modal */}
            <Modal
                isOpen={isProductModalOpen}
                onClose={() => {
                    setIsProductModalOpen(false);
                    setSelectedProduct(null);
                }}
                title=""
            >
                {selectedProduct && (
                    <div style={{ backgroundColor: theme.background_color }}>
                        {/* Product Image */}
                        <div className="mb-4">
                            {selectedProduct.images && selectedProduct.images.length > 0 ? (
                                selectedProduct.images.length > 1 ? (
                                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100">
                                        <div className="flex overflow-x-auto snap-x snap-mandatory h-full w-full hide-scrollbar">
                                            {selectedProduct.images.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`${getLocalizedText(selectedProduct, 'name')} ${idx + 1}`}
                                                    className="snap-center min-w-full h-full object-cover"
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                                            {selectedProduct.images.map((_, idx) => (
                                                <div key={idx} className="w-2 h-2 rounded-full bg-white opacity-75 shadow-sm" />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={selectedProduct.images[0]}
                                        alt={getLocalizedText(selectedProduct, 'name')}
                                        className="w-full aspect-[4/3] object-cover rounded-3xl"
                                    />
                                )
                            ) : (
                                <div className="w-full aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-3xl">
                                    <i className="fas fa-utensils text-4xl text-gray-300 opacity-50"></i>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="px-1 pb-2">
                            {/* First Row: Title and Price */}
                            <div className="flex items-center justify-between gap-4">
                                <h2
                                    className="text-xl font-bold flex-1"
                                    style={{
                                        color: theme.primary_color,
                                        fontFamily: theme.product_name_font
                                    }}
                                >
                                    {getLocalizedText(selectedProduct, 'name')}
                                </h2>
                                <span
                                    className="text-2xl font-bold flex-shrink-0"
                                    style={{
                                        color: theme.price_color,
                                        fontFamily: theme.product_name_font
                                    }}
                                >
                                    {`${Math.round(parseFloat(selectedProduct.price))} MKD`}
                                </span>
                            </div>

                            {/* Second Row: Description (Full Width) */}
                            {getProductDescription(selectedProduct) && (
                                <p
                                    className="text-sm leading-relaxed w-full"
                                    style={{
                                        color: theme.description_text_color || theme.text_color || '#6b7280',
                                        fontFamily: theme.description_font
                                    }}
                                >
                                    {getProductDescription(selectedProduct)}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PublicMenuPage;
