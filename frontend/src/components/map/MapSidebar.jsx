import { isBusinessOpen, getTypeConfig, getDistance, formatDistance, businessTypes } from '../../utils/mapHelpers';

const MapSidebar = ({
    listings, searchTerm, onSearchChange,
    typeFilter, onTypeFilterChange,
    showOpenOnly, onToggleOpenOnly,
    userLocation, onNearMe,
    selectedId, onSelect, isOpen, onToggle
}) => {
    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="map-sidebar-toggle"
                onClick={onToggle}
            >
                <i className={`fas fa-${isOpen ? 'times' : 'list'}`}></i>
                {!isOpen && <span style={{ marginLeft: '6px', fontSize: '13px' }}>Businesses</span>}
            </button>

            <div className={`map-sidebar ${isOpen ? 'map-sidebar--open' : ''}`}>
                <div className="map-sidebar-header">
                    <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
                        Businesses
                    </h3>

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search businesses..."
                        className="map-sidebar-search"
                    />

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <select
                            value={typeFilter}
                            onChange={(e) => onTypeFilterChange(e.target.value)}
                            className="map-sidebar-select"
                        >
                            <option value="">All Types</option>
                            {businessTypes.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>

                        <button
                            onClick={onNearMe}
                            className="map-sidebar-btn"
                            title="Find nearby"
                        >
                            <i className="fas fa-location-crosshairs"></i>
                        </button>
                    </div>

                    <label className="map-sidebar-toggle-label" style={{ marginTop: '8px' }}>
                        <input
                            type="checkbox"
                            checked={showOpenOnly}
                            onChange={onToggleOpenOnly}
                            style={{ marginRight: '6px' }}
                        />
                        <span style={{ fontSize: '13px', color: '#4b5563' }}>Open Now</span>
                    </label>
                </div>

                <div className="map-sidebar-list">
                    {listings.length === 0 && (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                            No businesses found.
                        </div>
                    )}
                    {listings.map(listing => {
                        const config = getTypeConfig(listing.business_type);
                        const openStatus = isBusinessOpen(listing.opening_hours);
                        const distance = userLocation
                            ? getDistance(userLocation.lat, userLocation.lng, parseFloat(listing.latitude), parseFloat(listing.longitude))
                            : null;

                        return (
                            <div
                                key={listing.id}
                                className={`map-sidebar-card ${selectedId === listing.id ? 'map-sidebar-card--active' : ''}`}
                                onClick={() => onSelect(listing.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: config.color, display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <i className={`fas ${config.icon}`} style={{ color: 'white', fontSize: '12px' }}></i>
                                    </span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontWeight: 600, fontSize: '14px', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {listing.business_name}
                                            </span>
                                            {listing.is_featured && (
                                                <i className="fas fa-star" style={{ color: '#f1c40f', fontSize: '11px', flexShrink: 0 }}></i>
                                            )}
                                        </div>
                                    </div>
                                    {openStatus !== null && (
                                        <span style={{
                                            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                            background: openStatus ? '#22c55e' : '#ef4444',
                                        }}></span>
                                    )}
                                </div>

                                {listing.address && (
                                    <p style={{ margin: '0', fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {listing.address}
                                    </p>
                                )}

                                {distance !== null && (
                                    <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', display: 'inline-block' }}>
                                        {formatDistance(distance)}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MapSidebar;
