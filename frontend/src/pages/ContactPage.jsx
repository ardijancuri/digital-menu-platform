import { useState } from 'react';
import PageLayout from '../components/PageLayout';

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <PageLayout>
            <section style={{ padding: '6rem 0 1rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="accent-line" style={{ margin: '0 auto 2rem' }}></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '0.5rem' }}>Get in Touch</h1>
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
                            <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>support@onipos.com</p>
                        </div>
                    </div>
                </div>
            </section>
            
        </PageLayout>
    );
};

export default ContactPage;
