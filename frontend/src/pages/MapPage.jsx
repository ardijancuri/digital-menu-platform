import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import MapView from '../components/map/MapView';
import MapMarker from '../components/map/MapMarker';
import MapSidebar from '../components/map/MapSidebar';
import { publicAPI } from '../services/api';
import { isBusinessOpen, sortByDistance } from '../utils/mapHelpers';
import '../styles/map.css';

const MapPage = () => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showOpenOnly, setShowOpenOnly] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [flyTo, setFlyTo] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await publicAPI.getMapListings();
                setListings(response.data.listings);
            } catch (err) {
                console.error('Failed to fetch map listings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = [...listings];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(l =>
                l.business_name.toLowerCase().includes(term) ||
                (l.address && l.address.toLowerCase().includes(term))
            );
        }

        if (typeFilter) {
            result = result.filter(l => l.business_type === typeFilter);
        }

        if (showOpenOnly) {
            result = result.filter(l => isBusinessOpen(l.opening_hours) === true);
        }

        if (userLocation) {
            result = sortByDistance(result, userLocation.lat, userLocation.lng);
        }

        setFilteredListings(result);
    }, [listings, searchTerm, typeFilter, showOpenOnly, userLocation]);

    const handleNearMe = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
                setUserLocation(loc);
                setFlyTo([loc.lat, loc.lng]);
            },
            () => {
                alert('Unable to get your location. Please allow location access.');
            }
        );
    }, []);

    const handleSelect = useCallback((id) => {
        setSelectedId(id);
        const listing = listings.find(l => l.id === id);
        if (listing) {
            setFlyTo([parseFloat(listing.latitude), parseFloat(listing.longitude)]);
            setSidebarOpen(false);
        }
    }, [listings]);

    return (
        <>
            <Navigation />
            <div className="map-page">
                <MapSidebar
                    listings={filteredListings}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                    showOpenOnly={showOpenOnly}
                    onToggleOpenOnly={() => setShowOpenOnly(prev => !prev)}
                    userLocation={userLocation}
                    onNearMe={handleNearMe}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(prev => !prev)}
                />

                <div className="map-container">
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f3f4f6' }}>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <MapView
                            center={[41.5, 21.4]}
                            zoom={8}
                            flyTo={flyTo}
                            flyToZoom={15}
                        >
                            {filteredListings.map(listing => (
                                <MapMarker
                                    key={listing.id}
                                    listing={listing}
                                    isSelected={selectedId === listing.id}
                                    onSelect={handleSelect}
                                />
                            ))}
                        </MapView>
                    )}
                </div>
            </div>
        </>
    );
};

export default MapPage;
