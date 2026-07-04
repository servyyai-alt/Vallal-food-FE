const BLOCKED_SUBSCRIPTION_STATUSES = new Set(['suspended', 'cancelled']);

const normalizeUrl = (value = '') => value.trim().replace(/\/+$/, '');

export const normalizeSubscriptionStatus = (status = '') =>
    String(status).trim().toLowerCase();

export const formatSubscriptionStatus = (status = '') => {
    const normalizedStatus = normalizeSubscriptionStatus(status);

    if (!normalizedStatus) {
        return 'Unknown';
    }

    return normalizedStatus
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

export const isSubscriptionAllowed = (status = '') =>
    !BLOCKED_SUBSCRIPTION_STATUSES.has(normalizeSubscriptionStatus(status));

export const isSubscriptionBlocked = (status = '') =>
    BLOCKED_SUBSCRIPTION_STATUSES.has(normalizeSubscriptionStatus(status));

export const getSubscriptionConfig = () => {
    const webbyApiUrl = normalizeUrl(import.meta.env.VITE_WEBBY_API_URL || '');
    const subscriptionId = String(import.meta.env.VITE_SUBSCRIPTION_ID || '').trim();

    if (!webbyApiUrl || !subscriptionId) {
        return {
            webbyApiUrl,
            subscriptionId,
            error: 'Missing VITE_WEBBY_API_URL or VITE_SUBSCRIPTION_ID.',
        };
    }

    return { webbyApiUrl, subscriptionId, error: null };
};

export const getWebbyHomeUrl = () => {
    const { webbyApiUrl } = getSubscriptionConfig();

    if (!webbyApiUrl) {
        return null;
    }

    try {
        return new URL('/', `${webbyApiUrl}/`).toString();
    } catch {
        return webbyApiUrl;
    }
};
