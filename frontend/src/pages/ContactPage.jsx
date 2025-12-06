import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../styles/landing.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

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
                    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="accent-line" style={{ margin: '0 auto 2rem' }}></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '1.5rem' }}>Get in Touch</h1>
                        <p className="body-lg">We'd love to hear from you</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '2rem 0 6rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <form onSubmit={handleSubmit} style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: '24px', padding: '3rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9375rem' }}>Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e5e5', borderRadius: '12px', fontSize: '1rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9375rem' }}>Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e5e5', borderRadius: '12px', fontSize: '1rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9375rem' }}>Message</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows="6"
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e5e5', borderRadius: '12px', fontSize: '1rem', resize: 'vertical' }}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                                Send Message
                            </button>
                        </form>

                        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                            <p style={{ color: '#666', marginBottom: '1rem' }}>Or reach us at:</p>
                            <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>support@menuplatform.com</p>
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

export default ContactPage;
