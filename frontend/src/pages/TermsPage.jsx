import { Link } from 'react-router-dom';
import '../styles/landing.css';

const TermsPage = () => {
    return (
        <div style={{ background: '#ffffff' }}>
            <nav className="navbar">
                <div className="container" style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                            <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>M</div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000' }}>MenuPlatform</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <section style={{ marginTop: '80px', padding: '6rem 0 6rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="accent-line"></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '2rem' }}>Terms of Service</h1>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: January 2025</p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            By accessing and using MenuPlatform, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>2. Use License</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            Permission is granted to use MenuPlatform for creating and managing digital menus for your restaurant or food service business.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>3. User Responsibilities</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>4. Content</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            You retain all rights to the content you upload to MenuPlatform. By uploading content, you grant us a license to use, store, and display that content as necessary to provide our services.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>5. Termination</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            We may terminate or suspend your account at any time for violations of these terms. You may cancel your account at any time through your account settings.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>6. Limitation of Liability</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            MenuPlatform shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>7. Contact</h2>
                        <p style={{ color: '#666', lineHeight: '1.8' }}>
                            If you have any questions about these Terms, please contact us at legal@menuplatform.com
                        </p>
                    </div>
                </div>
            </section>

            <footer className="footer" style={{ padding: '3rem 0 2rem' }}>
                <div className="container"><div style={{ textAlign: 'center' }}><p style={{ color: '#999', fontSize: '0.875rem' }}>© 2025 MenuPlatform. All rights reserved.</p></div></div>
            </footer>
        </div>
    );
};

export default TermsPage;
