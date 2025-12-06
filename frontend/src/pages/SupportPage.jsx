import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const SupportPage = () => {
    return (
        <PageLayout>
            <section style={{ padding: '6rem 0 4rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="accent-line" style={{ margin: '0 auto 2rem' }}></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '1.5rem' }}>Support Center</h1>
                        <p className="body-lg">We're here to help you succeed</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '2rem 0 6rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '2rem' }}>Frequently Asked Questions</h2>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>How do I get started?</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Simply click "Get Started" to create your account. You'll be up and running in less than 5 minutes with our guided setup process.</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Can I customize my menu design?</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Yes! You can upload your logo, choose custom colors, select fonts, and arrange your menu layout to match your brand perfectly.</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>How do customers access my menu?</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>You'll get a unique URL and QR code. Customers can scan the QR code with their phone or visit the URL directly to view your menu.</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Can I update my menu in real-time?</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Absolutely! Any changes you make go live immediately. Update prices, add new items, or mark items as unavailable anytime.</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>What support do you offer?</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>We offer 24/7 email support for all users. Pro plan users get priority support with faster response times.</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Is there a free trial?</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Yes! Our Free plan is available forever with no credit card required. You can upgrade to Pro anytime to unlock additional features.</p>
                        </div>

                        <div style={{ marginTop: '4rem', padding: '3rem', background: '#fafafa', borderRadius: '24px', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Still have questions?</h3>
                            <p style={{ color: '#666', marginBottom: '2rem' }}>Our support team is ready to help</p>
                            <Link to="/contact"><button className="btn-primary">Contact Support</button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default SupportPage;
