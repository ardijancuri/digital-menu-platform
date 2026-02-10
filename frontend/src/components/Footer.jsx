import { Link } from 'react-router-dom';
import opIcon from '../assets/op-icon.png';

const Footer = () => {
    return (
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
                            {import.meta.env.DEV && (
                                <li style={{ marginBottom: '0.5rem' }}><Link to="/map" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem' }}>Map</Link></li>
                            )}

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
    );
};

export default Footer;
