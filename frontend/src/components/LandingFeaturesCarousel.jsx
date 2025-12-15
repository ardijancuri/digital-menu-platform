import React, { useRef, useState, useEffect } from 'react';

const LandingFeaturesCarousel = ({ title, subtitle, features, align = 'left', fullWidth = true }) => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Update active index on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;

            const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
            // Get dynamic item width
            const firstItem = scrollRef.current.children[0];
            const itemWidth = firstItem ? firstItem.offsetWidth + 20 : 340; // 20px gap

            const newIndex = Math.round(scrollLeft / itemWidth);

            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }

            setCanScrollLeft(scrollLeft > 10); // buffer
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        };

        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll, { passive: true });
            // Initial check
            handleScroll();
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [activeIndex]);

    const scrollTo = (index) => {
        if (!scrollRef.current) return;
        const item = scrollRef.current.children[index];
        if (item) {
            const containerWidth = scrollRef.current.offsetWidth;
            const itemWidth = item.offsetWidth;

            let scrollLeft;

            if (align === 'left' && !fullWidth) {
                // If standard aligned, maybe just scroll to it?
                scrollLeft = item.offsetLeft;
            } else {
                // Center the item for full width carousel feel
                scrollLeft = item.offsetLeft - (containerWidth / 2) + (itemWidth / 2);
            }

            scrollRef.current.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
            setActiveIndex(index);
        }
    };

    const handlePrev = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
    };

    const carouselContent = (
        <div className="carousel-container">
            <div className="carousel-track-wrapper" ref={scrollRef} style={{ paddingBottom: '2rem', gap: '20px' }}>
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`feature-carousel-card ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => scrollTo(index)}
                        style={{
                            flex: '0 0 320px',
                            scrollSnapAlign: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <div className="feature-card-inner">
                            <div className="feature-icon">
                                <i className={feature.icon}></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>{feature.title}</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section className={`section-padding carousel-section`}>
            <div className="container">
                <div
                    className="carousel-header"
                    style={{
                        textAlign: align,
                        marginLeft: align === 'center' ? 'auto' : '0',
                        marginRight: align === 'center' ? 'auto' : '0',
                        maxWidth: '600px',
                        marginBottom: '1rem'
                    }}
                >
                    {title && <div className="accent-line animate-slide-in-left" style={{ margin: align === 'center' ? '0 auto 1rem auto' : '0 0 1rem 0' }}></div>}
                    {title && <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>{title}</h2>}
                    {subtitle && <p className="body-lg">{subtitle}</p>}
                </div>
            </div>

            {fullWidth ? (
                <div className="carousel-full-width-wrapper">
                    {carouselContent}
                </div>
            ) : (
                <div className="container">
                    {carouselContent}
                </div>
            )}

            <div className="container">
                <div className="carousel-controls-bottom">
                    <div className="carousel-arrows">
                        <button
                            className={`carousel-control prev ${!canScrollLeft ? 'disabled' : ''}`}
                            onClick={handlePrev}
                            aria-label="Previous slide"
                            disabled={!canScrollLeft}
                        >
                            <svg viewBox="0 0 18 18" style={{ width: '22px', height: '22px' }}>
                                <path fill="currentColor" d="M11.5 15.5a.99.99 0 0 1-.71-.29l-5.5-5.5a1 1 0 0 1 0-1.42l5.5-5.5a1 1 0 0 1 1.42 1.42L7.41 9l4.8 4.79a1 1 0 0 1-.71 1.71z" />
                            </svg>
                        </button>

                        <button
                            className={`carousel-control next ${!canScrollRight ? 'disabled' : ''}`}
                            onClick={handleNext}
                            aria-label="Next slide"
                            disabled={!canScrollRight}
                        >
                            <svg viewBox="0 0 18 18" style={{ width: '22px', height: '22px' }}>
                                <path fill="currentColor" d="M6.5 15.5a1 1 0 0 1-.71-1.71L10.59 9 5.79 4.21a1 1 0 0 1 1.42-1.42l5.5 5.5a1 1 0 0 1 0 1.42l-5.5 5.5a.99.99 0 0 1-.71.29z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingFeaturesCarousel;
