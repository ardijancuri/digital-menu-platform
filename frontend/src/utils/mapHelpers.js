/**
 * Check if a business is currently open based on opening_hours JSONB
 * Returns: true (open), false (closed), null (unknown/no hours set)
 */
export const isBusinessOpen = (openingHours) => {
    if (!openingHours || typeof openingHours !== 'object' || Object.keys(openingHours).length === 0) {
        return null;
    }

    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[now.getDay()];
    const todayHours = openingHours[today];

    if (!todayHours || !todayHours.open || !todayHours.close) return false;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [openH, openM] = todayHours.open.split(':').map(Number);
    const [closeH, closeM] = todayHours.close.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    // Handle overnight hours (e.g., open 18:00, close 02:00)
    if (closeMinutes < openMinutes) {
        return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
    }

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Sort listings by distance from a given point
 */
export const sortByDistance = (listings, userLat, userLng) => {
    return [...listings].sort((a, b) => {
        const distA = getDistance(userLat, userLng, parseFloat(a.latitude), parseFloat(a.longitude));
        const distB = getDistance(userLat, userLng, parseFloat(b.latitude), parseFloat(b.longitude));
        return distA - distB;
    });
};

/**
 * Format distance for display
 */
export const formatDistance = (km) => {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
};

/**
 * Business type display config
 */
export const businessTypes = [
    { value: 'restaurant', label: 'Restaurant', color: '#e74c3c', icon: 'fa-utensils' },
    { value: 'cafe', label: 'Cafe', color: '#8B4513', icon: 'fa-mug-hot' },
    { value: 'bar', label: 'Bar', color: '#9b59b6', icon: 'fa-cocktail' },
    { value: 'bakery', label: 'Bakery', color: '#f39c12', icon: 'fa-bread-slice' },
    { value: 'fast_food', label: 'Fast Food', color: '#e67e22', icon: 'fa-burger' },
    { value: 'pizzeria', label: 'Pizzeria', color: '#c0392b', icon: 'fa-pizza-slice' },
    { value: 'pub', label: 'Pub', color: '#2c3e50', icon: 'fa-beer-mug-empty' },
    { value: 'other', label: 'Other', color: '#7f8c8d', icon: 'fa-store' },
];

const businessTypeAliases = new Map([
    ['restaurant', 'restaurant'],
    ['cafe', 'cafe'],
    ['caf', 'cafe'],
    ['café', 'cafe'],
    ['cafã©', 'cafe'],
    ['bar', 'bar'],
    ['bakery', 'bakery'],
    ['fast_food', 'fast_food'],
    ['fast food', 'fast_food'],
    ['fast-food', 'fast_food'],
    ['pizzeria', 'pizzeria'],
    ['pizza', 'pizzeria'],
    ['pub', 'pub'],
    ['other', 'other'],
]);

export const normalizeBusinessType = (value) => {
    if (typeof value !== 'string') {
        return 'other';
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return 'other';
    }

    const lowerValue = trimmedValue.toLowerCase();
    if (businessTypeAliases.has(lowerValue)) {
        return businessTypeAliases.get(lowerValue);
    }

    const normalizedKey = lowerValue
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    return businessTypeAliases.get(normalizedKey) || normalizedKey || 'other';
};

export const getTypeConfig = (type) => {
    const normalizedType = normalizeBusinessType(type);
    return businessTypes.find(t => t.value === normalizedType) || businessTypes[businessTypes.length - 1];
};
