import { Link } from 'react-router-dom';
import '../styles/landing.css';

const FeaturesPage = () => {
    return (
        <div style={{ background: '#ffffff' }}>
            {/* Navbar */}
            <nav className="navbar">
                <div className="container" style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                            <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
                                M
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000' }}>MenuPlatform</span>
                        </Link>
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

            {/* Hero */}
            <section style={{ marginTop: '80px', padding: '6rem 0 4rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="accent-line" style={{ margin: '0 auto 2rem' }}></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '1.5rem' }}>
                            Powerful Features
                        </h1>
                        <p className="body-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
                            Everything you need to create and manage beautiful digital menus
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '4rem 0' }}>
                <div className="container">
                    <div className="grid-auto">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Mobile First Design</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Fully responsive menus that look perfect on any device. Your customers will enjoy a seamless experience whether they're on a phone, tablet, or desktop.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Real-Time Updates</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Make changes to your menu instantly. Update prices, add new items, or mark items as unavailable - all changes go live immediately.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-palette"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Custom Branding</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Upload your logo, choose your brand colors, and customize fonts to create a menu that perfectly represents your restaurant's identity.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-qrcode"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>QR Code Generation</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Automatically generate QR codes for contactless menu access. Print and place them on tables for easy customer access.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-images"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>High-Quality Images</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Upload beautiful photos of your dishes. Visual menus increase customer engagement and help showcase your culinary creations.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Analytics Dashboard</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Track menu views, popular items, and customer behavior. Make data-driven decisions to optimize your menu offerings.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-language"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Multi-Language Support</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Offer your menu in multiple languages to serve international customers and tourists with ease.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Secure & Reliable</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Enterprise-grade security with SSL encryption. 99.9% uptime guarantee ensures your menu is always accessible.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-tags"></i>
                            </div>
                            <h3 className="heading-md" style={{ marginBottom: '1rem', color: '#000' }}>Categories & Tags</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                Organize your menu with categories and tags. Add dietary labels like vegan, gluten-free, or spicy for easy filtering.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '4rem 0 6rem' }}>
                <div className="container">
                    <div className="cta-section">
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 className="heading-lg" style={{ color: 'white', marginBottom: '1.5rem' }}>
                                Ready to get started?
                            </h2>
                            <p className="body-lg" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                                Create your digital menu in minutes
                            </p>
                            <Link to="/apply">
                                <button className="btn-primary" style={{ background: 'white', color: '#000', padding: '1.25rem 2.5rem' }}>
                                    Start Free Trial →
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ padding: '3rem 0 2rem' }}>
                <div className="container">
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#999', fontSize: '0.875rem' }}>
                            © 2025 MenuPlatform. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FeaturesPage;
