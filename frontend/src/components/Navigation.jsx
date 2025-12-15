import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="navbar">
            <div className="container" style={{ padding: '0.5rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <div style={{ width: '40px', height: '40px', background: '#000', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
                            OP
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000' }}>ONIPOS</span>
                    </Link>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: '500' }}>
                            Sign In
                        </Link>
                        <Link to="/apply">
                            <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
