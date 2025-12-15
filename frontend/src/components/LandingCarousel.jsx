import React, { useRef, useState, useEffect } from 'react';

const LandingCarousel = ({ title, subtitle, images, fullWidth = false, align = 'center' }) => {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Update active index on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;

            const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
            const itemWidth = scrollRef.current.children[0]?.offsetWidth || clientWidth;
            const newIndex = Math.round(scrollLeft / (itemWidth + 24)); // 24 is gap

            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }

            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
        };

        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll, { passive: true });
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
            // Center the item
            const scrollLeft = item.offsetLeft - (containerWidth / 2) + (itemWidth / 2);

            scrollRef.current.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handlePrev = () => {
        scrollTo(Math.max(0, activeIndex - 1));
    };

    const handleNext = () => {
        scrollTo(Math.min(images.length - 1, activeIndex + 1));
    };

    const carouselContent = (
        <div className="carousel-container">
            <div className="carousel-track-wrapper" ref={scrollRef}>
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`carousel-card ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => scrollTo(index)}
                    >
                        <div className="carousel-image-container">
                            <img src={img} alt={`${title} ${index + 1}`} loading="lazy" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <section className={`section-padding carousel-section ${canScrollLeft ? 'scrolled' : ''}`}>
            <div className="container">
                <div
                    className="carousel-header"
                    style={{
                        textAlign: align,
                        marginLeft: align === 'center' ? 'auto' : '0',
                        marginRight: align === 'center' ? 'auto' : '0'
                    }}
                >
                    {title && <h2 className="heading-lg">{title}</h2>}
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

export default LandingCarousel;
