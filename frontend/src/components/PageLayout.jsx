import Navigation from './Navigation';
import Footer from './Footer';
import '../styles/landing.css';

const PageLayout = ({ children }) => {
    return (
        <div style={{ background: '#ffffff' }}>
            <Navigation />
            <div style={{ marginTop: '80px' }}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default PageLayout;
