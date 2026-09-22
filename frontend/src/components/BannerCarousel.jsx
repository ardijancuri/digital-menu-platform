import { useCallback, useEffect, useRef, useState } from 'react';

export default function BannerCarousel({ images }) {
    const containerRef = useRef(null);
    const touchRef = useRef(null);
    const [paused, setPaused] = useState(false);
    const [visible, setVisible] = useState(false);
    const [pageVisible, setPageVisible] = useState(() => !document.hidden);
    const [slides, setSlides] = useState({ active: 0, requested: 0, visited: [0], ready: [] });

    useEffect(() => {
        const onVisibility = () => setPageVisible(!document.hidden);
        document.addEventListener('visibilitychange', onVisibility);
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    const selectSlide = useCallback((index) => {
        setSlides(previous => ({
            ...previous,
            requested: index,
            active: previous.ready.includes(index) ? index : previous.active,
            visited: previous.visited.includes(index) ? previous.visited : [...previous.visited, index],
        }));
    }, []);

    useEffect(() => {
        if (images.length < 2 || paused || !visible || !pageVisible) return;
        const timer = setTimeout(() => selectSlide((slides.requested + 1) % images.length), 5000);
        return () => clearTimeout(timer);
    }, [images.length, paused, visible, pageVisible, slides.requested, selectSlide]);

    const finishSlide = (index) => setSlides(previous => ({
        ...previous,
        ready: previous.ready.includes(index) ? previous.ready : [...previous.ready, index],
        active: previous.requested === index ? index : previous.active,
    }));

    return (
        <div ref={containerRef} className="px-5 mb-10" style={{ touchAction: 'pan-y pinch-zoom' }}
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            onTouchStart={event => {
                setPaused(true);
                const touch = event.touches[0];
                touchRef.current = { start: touch.clientX, end: touch.clientX, startY: touch.clientY, endY: touch.clientY };
            }}
            onTouchMove={event => {
                if (touchRef.current) {
                    touchRef.current.end = event.touches[0].clientX;
                    touchRef.current.endY = event.touches[0].clientY;
                }
            }}
            onTouchCancel={() => { touchRef.current = null; setPaused(false); }}
            onTouchEnd={event => {
                const touch = touchRef.current;
                if (touch && event.changedTouches[0]) {
                    touch.end = event.changedTouches[0].clientX;
                    touch.endY = event.changedTouches[0].clientY;
                }
                if (touch && Math.abs(touch.start - touch.end) > 50 && Math.abs(touch.start - touch.end) > Math.abs(touch.startY - touch.endY) * 1.1) {
                    selectSlide((slides.requested + (touch.start > touch.end ? 1 : -1) + images.length) % images.length);
                }
                touchRef.current = null;
                setPaused(false);
            }}>
            <div className="relative rounded-[30px] overflow-hidden aspect-[2/1]">
                {images.map((image, index) => slides.visited.includes(index) && (
                    <div key={`${index}-${image}`} aria-hidden={index !== slides.active}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === slides.active ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={image} alt="Banner" loading="eager" decoding="async"
                            onLoad={() => finishSlide(index)} onError={() => finishSlide(index)}
                            className="w-full h-full object-cover" />
                    </div>
                ))}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, index) => (
                        <button key={index} type="button" aria-label={`Show banner ${index + 1}`}
                            aria-pressed={index === slides.active} onClick={() => selectSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${index === slides.active ? 'bg-white w-6' : 'bg-white/50'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
