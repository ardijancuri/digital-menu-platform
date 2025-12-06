import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/landing.css';

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
        <div style={{ background: '#ffffff' }}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="container" style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
                                M
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000' }}>MenuPlatform</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <Link to="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: '500' }}>
                                Sign In
                            </Link>
                            <Link to="/apply">
                                <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="section-padding" style={{ marginTop: '80px', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
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
                                <button className="btn-primary" style={{ padding: '1.25rem 2.5rem' }}>
                                    Start Free Trial
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="btn-secondary" style={{ padding: '1.25rem 2.5rem' }}>
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
            <section style={{ background: '#fafafa', padding: '3rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                        <div className="stat-card animate-scale-in">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Restaurants</div>
                        </div>
                        <div className="stat-card animate-scale-in delay-100">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Menu Views</div>
                        </div>
                        <div className="stat-card animate-scale-in delay-200">
                            <div className="stat-number">99.9%</div>
                            <div className="stat-label">Uptime</div>
                        </div>
                        <div className="stat-card animate-scale-in delay-300">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ maxWidth: '600px', marginBottom: '4rem' }}>
                        <div className="accent-line animate-slide-in-left"></div>
                        <h2 className="heading-lg animate-fade-in-up" style={{ color: '#000', marginBottom: '1rem' }}>
                            Everything you need,
                            <br />nothing you don't
                        </h2>
                        <p className="body-lg animate-fade-in-up delay-100">
                            Simple, powerful features designed for modern restaurants
                        </p>
                    </div>

                    <div className="grid-auto">
                        <div className="feature-card animate-fade-in-up delay-100">
                            <div className="feature-icon">
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Mobile First</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Optimized for smartphones. Your customers get a perfect experience on any device.
                            </p>
                        </div>

                        <div className="feature-card animate-fade-in-up delay-200">
                            <div className="feature-icon">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Instant Updates</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Change prices and items in real-time. Updates go live immediately.
                            </p>
                        </div>

                        <div className="feature-card animate-fade-in-up delay-300">
                            <div className="feature-icon">
                                <i className="fas fa-palette"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Your Brand</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Customize colors, fonts, and layout to match your restaurant's identity.
                            </p>
                        </div>

                        <div className="feature-card animate-fade-in-up delay-400">
                            <div className="feature-icon">
                                <i className="fas fa-qrcode"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>QR Codes</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Generate QR codes for contactless menu access. Print and place on tables.
                            </p>
                        </div>

                        <div className="feature-card animate-fade-in-up delay-500">
                            <div className="feature-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Analytics</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Track views and popular items. Make data-driven menu decisions.
                            </p>
                        </div>

                        <div className="feature-card animate-fade-in-up delay-600">
                            <div className="feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Secure</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Enterprise-grade security. Your data is encrypted and protected.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="section-padding" style={{ background: '#fafafa' }}>
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
                                <button className="btn-primary" style={{ background: 'white', color: '#000', padding: '1.25rem 2.5rem' }}>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ width: '32px', height: '32px', background: '#000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem' }}>
                                    M
                                </div>
                                <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>MenuPlatform</span>
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
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/examples" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Examples</Link></li>
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
                            © 2025 MenuPlatform. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
