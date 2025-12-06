import { Link } from 'react-router-dom';
import '../styles/landing.css';

const PricingPage = () => {
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
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="accent-line" style={{ margin: '0 auto 2rem' }}></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '1.5rem' }}>Simple, Transparent Pricing</h1>
                        <p className="body-lg">Start free, upgrade when you're ready</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '2rem 0 6rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                        <div className="feature-card" style={{ padding: '3rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Free</h3>
                            <div style={{ fontSize: '3rem', fontWeight: '600', margin: '1rem 0' }}>$0<span style={{ fontSize: '1.25rem', color: '#666' }}>/mo</span></div>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>Perfect for getting started</p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Up to 50 menu items</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Basic customization</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ QR code generation</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Mobile responsive</li>
                            </ul>
                            <Link to="/apply"><button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</button></Link>
                        </div>

                        <div className="feature-card" style={{ padding: '3rem', border: '2px solid #000' }}>
                            <div style={{ background: '#000', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', display: 'inline-block', marginBottom: '1rem' }}>POPULAR</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Pro</h3>
                            <div style={{ fontSize: '3rem', fontWeight: '600', margin: '1rem 0' }}>$29<span style={{ fontSize: '1.25rem', color: '#666' }}>/mo</span></div>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>For growing restaurants</p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Unlimited menu items</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Full customization</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Analytics dashboard</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Priority support</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Multi-language</li>
                            </ul>
                            <Link to="/apply"><button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Start Free Trial</button></Link>
                        </div>

                        <div className="feature-card" style={{ padding: '3rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Enterprise</h3>
                            <div style={{ fontSize: '3rem', fontWeight: '600', margin: '1rem 0' }}>Custom</div>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>For large operations</p>
                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Everything in Pro</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Multiple locations</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ API access</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Dedicated support</li>
                                <li style={{ padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>✓ Custom integrations</li>
                            </ul>
                            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Contact Sales</button>
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

export default PricingPage;
