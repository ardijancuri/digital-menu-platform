import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/landing.css';
import Navigation from '../components/Navigation';
import LandingCarousel from '../components/LandingCarousel';
import LandingMenuGrid from '../components/LandingMenuGrid';
import LandingFeaturesCarousel from '../components/LandingFeaturesCarousel';
import opIcon from '../assets/op-icon.png';

// Import Menu Images
import menu1 from '../assets/menu-images/menu 1.png';
import menu2 from '../assets/menu-images/menu 2.png';
import menuMulti from '../assets/menu-images/menu multiple languages.png';

// Import POS Images
import pos1 from '../assets/POS/pos 1.png';
import pos2 from '../assets/POS/pos2.png';
import pos3 from '../assets/POS/pos3.png';
import pos4 from '../assets/POS/pos4.png';
import pos5 from '../assets/POS/pos5.png';

const LandingPage = () => {
    useEffect(() => {
        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.querySelectorAll('[class*="animate-"]').forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });

        // Navbar scroll effect
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div style={{ background: '#f5f5f7', minHeight: '100vh' }}>
            {/* Navbar */}
            {/* Navbar */}
            <Navigation />

            {/* Hero Section */}
            <section className="section-padding" style={{ marginTop: '60px', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
                            <span style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#f5f5f5', borderRadius: '100px', fontSize: '0.875rem', fontWeight: '500', color: '#666', letterSpacing: '0.05em' }}>
                                DIGITAL MENU PLATFORM
                            </span>
                        </div>

                        <h1 className="heading-xl animate-fade-in-up delay-100" style={{ color: '#000', marginBottom: '2rem' }}>
                            The Modern Way to
                            <br />
                            <span style={{ color: '#0066ff' }}>Showcase Your Menu</span>
                        </h1>

                        <p className="body-lg animate-fade-in-up delay-200" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
                            Create beautiful digital menus in minutes. No coding required.
                            Perfect for restaurants, cafes, and bars.
                        </p>

                        <div className="animate-fade-in-up delay-300" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link to="/apply">
                                <button className="btn-primary">
                                    Start Free Trial
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="btn-secondary">
                                    View Demo
                                </button>
                            </Link>
                        </div>

                        <div className="animate-fade-in delay-400" style={{ marginTop: '4rem', display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>✓ No credit card</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>✓ 5 min setup</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>✓ Free forever</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ padding: '3rem 0' }}>
                <div className="container">
                    <div style={{
                        maxWidth: '1000px',
                        margin: '0 auto',
                        background: 'white',
                        borderRadius: '24px',
                        padding: '3rem 2rem',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                        border: '1px solid #e5e5e5'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div className="stat-card animate-scale-in delay-100" style={{ background: 'transparent', padding: '1rem' }}>
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Menu Views</div>
                            </div>
                            <div className="stat-card animate-scale-in delay-200" style={{ background: 'transparent', padding: '1rem' }}>
                                <div className="stat-number">99.9%</div>
                                <div className="stat-label">Uptime</div>
                            </div>
                            <div className="stat-card animate-scale-in delay-300" style={{ background: 'transparent', padding: '1rem' }}>
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu Showcase */}
            <div style={{ paddingBottom: '2rem' }}>
                <LandingMenuGrid
                    title="Beautiful Digital Menus"
                    subtitle="Engage your customers with high-quality visuals and a seamless browsing experience."
                    images={[menu1, menuMulti, menu2]}
                />
            </div>

            {/* POS Showcase */}
            <div style={{ paddingTop: '2rem' }}>
                <LandingCarousel
                    title="Powerful Point of Sale"
                    subtitle="Everything you need to run your restaurant, all in one place."
                    images={[pos1, pos2, pos3, pos4, pos5]}
                    fullWidth={true}
                    align="left"
                    noHover={true}
                    fullOpacityInactive={true}
                />
            </div>

            {/* Features Showcase Carousel */}
            <div>
                <LandingFeaturesCarousel
                    title="Everything you need, nothing you don't"
                    subtitle="Simple, powerful features designed for modern restaurants"
                    align="left"
                    fullWidth={true}
                    features={[
                        {
                            icon: "fas fa-mobile-alt",
                            title: "Mobile First",
                            description: "Optimized for smartphones. Your customers get a perfect experience on any device."
                        },
                        {
                            icon: "fas fa-bolt",
                            title: "Instant Updates",
                            description: "Change prices and items in real-time. Updates go live immediately."
                        },
                        {
                            icon: "fas fa-palette",
                            title: "Your Brand",
                            description: "Customize colors, fonts, and layout to match your restaurant's identity."
                        },
                        {
                            icon: "fas fa-qrcode",
                            title: "QR Codes",
                            description: "Generate QR codes for contactless menu access. Print and place on tables."
                        },
                        {
                            icon: "fas fa-chart-line",
                            title: "Analytics",
                            description: "Track views and popular items. Make data-driven menu decisions."
                        },
                        {
                            icon: "fas fa-shield-alt",
                            title: "Secure",
                            description: "Enterprise-grade security. Your data is encrypted and protected."
                        }
                    ]}
                />
            </div>

            {/* How it Works */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 className="heading-lg animate-fade-in-up" style={{ color: '#000', marginBottom: '1rem' }}>
                            Get started in 3 steps
                        </h2>
                        <p className="body-lg animate-fade-in-up delay-100">
                            Launch your digital menu in under 5 minutes
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
                        <div className="animate-fade-in-up delay-100" style={{ textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', background: '#000', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '600', margin: '0 auto 2rem' }}>
                                1
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Sign Up</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Create your account in 30 seconds. No credit card required.
                            </p>
                        </div>

                        <div className="animate-fade-in-up delay-200" style={{ textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', background: '#000', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '600', margin: '0 auto 2rem' }}>
                                2
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Add Items</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Upload your menu items with photos and prices.
                            </p>
                        </div>

                        <div className="animate-fade-in-up delay-300" style={{ textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', background: '#000', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '600', margin: '0 auto 2rem' }}>
                                3
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Go Live</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Share your menu URL or QR code with customers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding">
                <div className="container">
                    <div className="cta-section animate-scale-in">
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 className="heading-lg" style={{ color: 'white', marginBottom: '1.5rem' }}>
                                Ready to modernize your menu?
                            </h2>
                            <p className="body-lg" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                                Join hundreds of restaurants already using MenuPlatform
                            </p>
                            <Link to="/apply">
                                <button className="btn-primary" style={{ background: 'white', color: '#000' }}>
                                    Start Free Trial
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ padding: '4rem 0 2rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                                <img 
                                    src={opIcon} 
                                    alt="ONIPOS Logo" 
                                    style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '1.125rem', fontWeight: '600', lineHeight: '1.1' }}>ONIPOS</span>
                                    <span style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.1' }}>Powered by ONINOVA</span>
                                </div>
                            </div>
                            <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: '1.6' }}>
                                Modern digital menus for modern restaurants.
                            </p>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9375rem' }}>Product</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/features" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Features</Link></li>
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/pricing" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Pricing</Link></li>

                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9375rem' }}>Company</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/about" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>About</Link></li>
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/contact" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Contact</Link></li>
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/support" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Support</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: '600', marginBottom: '1rem', fontSize: '0.9375rem' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/privacy" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Privacy</Link></li>
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/terms" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Terms</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '2rem', textAlign: 'center' }}>
                        <p style={{ color: '#999', fontSize: '0.875rem' }}>
                            © 2025 OniPOS. Powered by <a href="https://oninova.net" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'none', fontWeight: '500' }}>ONINOVA</a>.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
