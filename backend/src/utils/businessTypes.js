export const BUSINESS_TYPE_VALUES = [
    'restaurant',
    'cafe',
    'bar',
    'bakery',
    'fast_food',
    'pizzeria',
    'pub',
    'other',
];

const BUSINESS_TYPE_ALIASES = new Map([
    ['restaurant', 'restaurant'],
    ['restaurants', 'restaurant'],
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
        return null;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return null;
    }

    const lowerValue = trimmedValue.toLowerCase();
    if (BUSINESS_TYPE_ALIASES.has(lowerValue)) {
        return BUSINESS_TYPE_ALIASES.get(lowerValue);
    }

    const normalizedKey = lowerValue
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    if (BUSINESS_TYPE_ALIASES.has(normalizedKey)) {
        return BUSINESS_TYPE_ALIASES.get(normalizedKey);
    }

    return BUSINESS_TYPE_VALUES.includes(normalizedKey) ? normalizedKey : null;
};

export const coerceBusinessType = (value, fallback = 'restaurant') => {
    return normalizeBusinessType(value) || fallback;
};
