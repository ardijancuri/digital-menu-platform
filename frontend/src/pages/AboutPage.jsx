import PageLayout from '../components/PageLayout';

const AboutPage = () => {
    return (
        <PageLayout>
            <section style={{ padding: '6rem 0 4rem' }}>
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
                            <div style={{ width: '64px', height: '64px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem', color: '#000' }}>
                                <i className="fas fa-bullseye"></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Simplicity</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>We believe great tools should be easy to use</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem', color: '#000' }}>
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Speed</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Fast setup, fast updates, fast support</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem', color: '#000' }}>
                                <i className="fas fa-handshake"></i>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem' }}>Partnership</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Your success is our success</p>
                        </div>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default AboutPage;
