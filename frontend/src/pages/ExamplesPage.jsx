import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const ExamplesPage = () => {
    return (
        <PageLayout>
            <section style={{ padding: '6rem 0 4rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <div className="accent-line" style={{ margin: '0 auto 2rem' }}></div>
                        <h1 className="heading-xl" style={{ color: '#000', marginBottom: '1.5rem' }}>Menu Examples</h1>
                        <p className="body-lg">See how restaurants are using MenuPlatform</p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '2rem 0 6rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        <div className="feature-card">
                            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>🍕</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>Italian Restaurant</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>Classic Italian menu with pasta, pizza, and wine selections. Features high-quality food photography and elegant typography.</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Photos</span>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Categories</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>☕</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>Coffee Shop</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>Modern coffee shop menu featuring specialty drinks, pastries, and breakfast items with minimalist design.</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Minimal</span>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Clean</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>🍣</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>Sushi Bar</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>Japanese restaurant menu with sushi rolls, sashimi, and traditional dishes. Includes dietary labels and allergen information.</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Allergens</span>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Multi-language</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>🍔</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>Burger Joint</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>Casual burger restaurant with build-your-own options, sides, and craft beverages. Bold colors and playful design.</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Customizable</span>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Bold</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>🥗</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>Healthy Cafe</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>Health-focused menu with salads, smoothies, and organic options. Features nutritional information and vegan labels.</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Nutrition</span>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Vegan</span>
                            </div>
                        </div>

                        <div className="feature-card">
                            <div style={{ width: '100%', height: '200px', background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem' }}>🍷</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>Wine Bar</h3>
                            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>Sophisticated wine list with detailed descriptions, pairings, and small plates. Elegant and refined design.</p>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Elegant</span>
                                <span style={{ padding: '0.25rem 0.75rem', background: '#f0f0f0', borderRadius: '100px', fontSize: '0.875rem' }}>Detailed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '4rem 0 6rem', background: '#fafafa' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                        <h2 className="heading-lg" style={{ color: '#000', marginBottom: '1.5rem' }}>Create Your Own</h2>
                        <p className="body-lg" style={{ marginBottom: '2rem' }}>Start building your custom menu today</p>
                        <Link to="/apply"><button className="btn-primary" style={{ padding: '1.25rem 2.5rem' }}>Get Started Free</button></Link>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default ExamplesPage;
