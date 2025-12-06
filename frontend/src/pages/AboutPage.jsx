import { Link } from 'react-router-dom';
import '../styles/landing.css';

const AboutPage = () => {
    return (
        <div style={{ background: '#ffffff' }}>
            <nav className="navbar">
                <div className="container" style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                            <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>M</div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000' }}>MenuPlatform</span>
                        </Link>
                        <Link to="/apply"><button className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>Get Started</button></Link>
                    </div>
                </div>
            </nav>

            <section style={{ marginTop: '80px', padding: '6rem 0 4rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="accent-line"></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '2rem' }}>About MenuPlatform</h1>
                        <p className="body-lg" style={{ marginBottom: '2rem' }}>
                            We're on a mission to help restaurants modernize their operations and provide better experiences for their customers.
                        </p>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            Founded in 2024, MenuPlatform was born from a simple observation: traditional paper menus are outdated, difficult to update, and don't provide the flexibility that modern restaurants need.
                        </p>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            We built MenuPlatform to solve this problem. Our platform makes it easy for restaurants of all sizes to create beautiful, mobile-friendly digital menus that can be updated in real-time.
                        </p>
                        <p style={{ color: '#666', lineHeight: '1.8' }}>
                            Today, we're proud to serve over 500 restaurants worldwide, helping them showcase their offerings and connect with customers in new ways.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '4rem 0 6rem', background: '#fafafa' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="heading-lg" style={{ color: '#000', marginBottom: '1rem' }}>Our Values</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Simplicity</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>We believe great tools should be easy to use</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Speed</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Fast setup, fast updates, fast support</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Partnership</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Your success is our success</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer" style={{ padding: '3rem 0 2rem' }}>
                <div className="container"><div style={{ textAlign: 'center' }}><p style={{ color: '#999', fontSize: '0.875rem' }}>© 2025 MenuPlatform. All rights reserved.</p></div></div>
            </footer>
        </div>
    );
};

export default AboutPage;
