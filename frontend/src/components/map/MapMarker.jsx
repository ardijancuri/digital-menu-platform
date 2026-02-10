import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getTypeConfig } from '../../utils/mapHelpers';
import BusinessPopup from './BusinessPopup';

const createMarkerIcon = (listing) => {
    const config = getTypeConfig(listing.business_type);
    const isFeatured = listing.is_featured;
    const size = isFeatured ? 40 : 34;
    const borderColor = isFeatured ? '#f1c40f' : '#ffffff';
    const shadow = isFeatured
        ? '0 0 10px rgba(241, 196, 15, 0.5), 0 2px 6px rgba(0,0,0,0.3)'
        : '0 2px 6px rgba(0,0,0,0.3)';

    return L.divIcon({
        className: 'custom-map-marker-wrapper',
        iconSize: [size, size + 10],
        iconAnchor: [size / 2, size + 10],
        popupAnchor: [0, -(size + 5)],
        html: `
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: ${config.color};
                border: 3px solid ${borderColor};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: ${shadow};
            ">
                <i class="fas ${config.icon}" style="
                    transform: rotate(45deg);
                    color: white;
                    font-size: ${isFeatured ? '16px' : '13px'};
                "></i>
            </div>
        `
    });
};

const MapMarker = ({ listing, isSelected, onSelect }) => {
    const icon = createMarkerIcon(listing);

    return (
        <Marker
            position={[parseFloat(listing.latitude), parseFloat(listing.longitude)]}
            icon={icon}
            eventHandlers={{
                click: () => onSelect && onSelect(listing.id),
            }}
        >
            <Popup maxWidth={300} minWidth={250}>
                <BusinessPopup listing={listing} />
            </Popup>
        </Marker>
    );
};

export default MapMarker;
