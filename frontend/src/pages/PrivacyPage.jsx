import PageLayout from '../components/PageLayout';

const PrivacyPage = () => {
    return (
        <PageLayout>
            <section style={{ padding: '6rem 0 6rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="accent-line"></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '2rem' }}>Privacy Policy</h1>
                        <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: January 2025</p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            We collect information you provide directly to us, including your name, email address, business information, and menu content when you create an account and use our services.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect MenuPlatform and our users.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>3. Information Sharing</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, and as required by law.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>4. Data Security</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>5. Your Rights</h2>
                        <p style={{ color: '#666', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                            You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us.
                        </p>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginTop: '3rem', marginBottom: '1rem' }}>6. Contact Us</h2>
                        <p style={{ color: '#666', lineHeight: '1.8' }}>
                            If you have any questions about this Privacy Policy, please contact us at privacy@menuplatform.com
                        </p>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default PrivacyPage;
