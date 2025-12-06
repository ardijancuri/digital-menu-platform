import PageLayout from '../components/PageLayout';

const TermsPage = () => {
    return (
        <PageLayout>
            <section style={{ padding: '6rem 0 6rem' }}>
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
        </PageLayout>
    );
};

export default TermsPage;
