const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5050'
    : 'https://webengineering.ins.hs-anhalt.de:10052';

export function getApiUrl(endpoint) {
    console.log(`${API_BASE_URL} called with:`, endpoint);
    return `${API_BASE_URL}${endpoint}`;
}