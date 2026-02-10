import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import opIcon from '../assets/op-icon.png';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const hamburgerButtonRef = useRef(null);

    const navLinks = [
        { path: '/about', label: 'About' },
        ...(import.meta.env.DEV ? [{ path: '/map', label: 'Map' }] : []),
        { path: '/pricing', label: 'Pricing' },
        { path: '/features', label: 'Features' },
        { path: '/contact', label: 'Contact' }
    ];

    const closeMenu = () => {
        setIsMenuOpen(false);
        // Return focus to hamburger button when menu closes
        if (hamburgerButtonRef.current) {
            hamburgerButtonRef.current.focus();
        }
    };

    // Handle menu open/close, outside clicks, and keyboard events
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                // Check if click is on hamburger button
                const hamburgerButton = event.target.closest('.hamburger-button');
                if (!hamburgerButton) {
                    closeMenu();
                }
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        };

        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Add event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        // Focus on close button when menu opens for accessibility
        const closeButton = menuRef.current?.querySelector('.flyout-menu-close');
        if (closeButton) {
            setTimeout(() => closeButton.focus(), 100);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <>
            <nav className="navbar">
                <div className="container" style={{ padding: '0.5rem 2rem' }}>
                    <div className="navbar-content">
                        {/* Logo */}
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                            <img 
                                src={opIcon} 
                                alt="ONIPOS Logo" 
                                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000', lineHeight: '1.1' }}>ONIPOS</span>
                                <span style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.1' }}>Powered by ONINOVA</span>
                            </div>
                        </Link>

                        {/* Center Navigation Links - Desktop Only */}
                        <div className="nav-links-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="nav-link"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side - Actions */}
                        <div className="nav-actions">
                            {/* Hamburger Button - Mobile/Tablet Only */}
                            <button
                                ref={hamburgerButtonRef}
                                className="hamburger-button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle menu"
                                aria-expanded={isMenuOpen}
                                aria-controls="flyout-menu"
                            >
                                <i className="fas fa-bars"></i>
                            </button>

                            {/* Sign In and Get Started - Desktop Only */}
                            <div className="nav-buttons-desktop">
                                <Link to="/login" className="btn-sign-in">
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
                </div>
            </nav>

            {/* Overlay */}
            {isMenuOpen && (
                <div 
                    className="menu-overlay"
                    onClick={closeMenu}
                    aria-hidden="true"
                ></div>
            )}

            {/* Flyout Menu - Mobile/Tablet */}
            <div 
                ref={menuRef}
                id="flyout-menu"
                className={`flyout-menu ${isMenuOpen ? 'flyout-menu-open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                <div className="flyout-menu-header">
                    <Link to="/" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
                        <img 
                            src={opIcon} 
                            alt="ONIPOS Logo" 
                            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#000', lineHeight: '1.1' }}>ONIPOS</span>
                            <span style={{ fontSize: '0.7rem', color: '#666', lineHeight: '1.1' }}>Powered by ONINOVA</span>
                        </div>
                    </Link>
                    <button
                        className="flyout-menu-close"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <nav className="flyout-menu-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="flyout-menu-link"
                            onClick={closeMenu}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flyout-menu-actions">
                        <Link
                            to="/login"
                            className="btn-sign-in flyout-sign-in"
                            onClick={closeMenu}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/apply"
                            className="flyout-menu-button"
                            onClick={closeMenu}
                        >
                            <button className="btn-primary" style={{ width: '100%', padding: '0.75rem 1.5rem', fontSize: '0.9375rem' }}>
                                Get Started
                            </button>
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navigation;
