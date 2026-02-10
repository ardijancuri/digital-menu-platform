import { isBusinessOpen, getTypeConfig } from '../../utils/mapHelpers';

const BusinessPopup = ({ listing }) => {
    const config = getTypeConfig(listing.business_type);
    const openStatus = isBusinessOpen(listing.opening_hours);

    const menuLink = listing.source === 'platform' && listing.menu_slug
        ? `/menu/${listing.menu_slug}`
        : listing.website_url;

    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${listing.latitude},${listing.longitude}`;

    return (
        <div style={{ fontFamily: "'Roboto Condensed', sans-serif", minWidth: '200px' }}>
            {/* Name row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', paddingRight: '18px' }}>
                <span style={{
                    width: '22px', height: '22px', borderRadius: '50%', background: config.color,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                    <i className={`fas ${config.icon}`} style={{ color: 'white', fontSize: '10px' }}></i>
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', lineHeight: 1.2 }}>
                    {listing.business_name}
                </span>
                {listing.is_featured && (
                    <i className="fas fa-star" style={{ color: '#f1c40f', fontSize: '11px', flexShrink: 0 }}></i>
                )}
                {openStatus !== null && (
                    <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        color: openStatus ? '#16a34a' : '#dc2626',
                        flexShrink: 0,
                    }}>
                        {openStatus ? 'Open' : 'Closed'}
                    </span>
                )}
            </div>

            {/* Details */}
            {listing.address && (
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#9ca3af', paddingLeft: '28px', lineHeight: 1.3 }}>
                    {listing.address}
                </p>
            )}

            {listing.phone && (
                <p style={{ margin: '2px 0', fontSize: '11px', color: '#9ca3af', paddingLeft: '28px', lineHeight: 1.3 }}>
                    <a href={`tel:${listing.phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        {listing.phone}
                    </a>
                </p>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                {menuLink && (
                    <a
                        href={menuLink}
                        target={listing.source === 'external' ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        style={{
                            flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            gap: '4px', padding: '5px 8px', background: '#1f2937', color: 'white',
                            borderRadius: '6px', fontSize: '11px', fontWeight: 600, textDecoration: 'none',
                        }}
                    >
                        <i className="fas fa-utensils" style={{ fontSize: '10px' }}></i>
                        Menu
                    </a>
                )}
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        gap: '4px', padding: '5px 8px', background: '#3b82f6', color: 'white',
                        borderRadius: '6px', fontSize: '11px', fontWeight: 600, textDecoration: 'none',
                    }}
                >
                    <i className="fas fa-directions" style={{ fontSize: '10px' }}></i>
                    Directions
                </a>
            </div>
        </div>
    );
};

export default BusinessPopup;
