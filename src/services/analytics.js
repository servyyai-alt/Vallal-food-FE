const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

export const analyticsEnabled = Boolean(measurementId);

export const getAnalyticsMeasurementId = () => measurementId;

export const trackPageView = ({ page_path, page_title, page_location }) => {
  if (!analyticsEnabled || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path,
    page_title,
    page_location
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!analyticsEnabled || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, params);
};
