import React, { useRef, useState, useEffect } from 'react';

const LandingMenuGrid = ({ title, subtitle, images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            // Or better logic if items are smaller than full width. 
            // Previous css set items to 70%.
            // width of item is roughly clientWidth * 0.70.
            // Let's just use a rough estimate or simply divide scrollLeft by approximate item width.

            // Actually, for a simple dots indicator on mobile where it snaps:
            // The center point logic is usually reliable.
            // Let's try:
            const itemWidth = scrollRef.current.children[0]?.offsetWidth || clientWidth;
            const newIndex = Math.round(scrollLeft / itemWidth);
            setActiveIndex(newIndex);
        }
    };

    return (
        <section className="section-padding">
            <div className="container">
                <div style={{ marginBottom: '4rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
                    {title && <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>{title}</h2>}
                    {subtitle && <p className="body-lg">{subtitle}</p>}
                </div>

                <div className="menu-grid" ref={scrollRef} onScroll={handleScroll}>
                    {images.map((img, index) => (
                        <div key={index} className={`menu-grid-item item-${index}`}>
                            <div className="menu-grid-image-wrapper">
                                <img src={img} alt={`Menu Showcase ${index + 1}`} loading="lazy" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Dots */}
                <div className="menu-grid-dots">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`menu-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => {
                                if (scrollRef.current) {
                                    const item = scrollRef.current.children[index];
                                    if (item) {
                                        scrollRef.current.scrollTo({
                                            left: item.offsetLeft - 20, // Adjust for padding/gap
                                            behavior: 'smooth'
                                        });
                                    }
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingMenuGrid;
