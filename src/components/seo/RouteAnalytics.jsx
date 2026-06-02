import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { analyticsEnabled, getAnalyticsMeasurementId, trackPageView } from '../../services/analytics';

export function AnalyticsScripts() {
  const measurementId = getAnalyticsMeasurementId();

  if (!analyticsEnabled || !measurementId) {
    return null;
  }

  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </script>
    </Helmet>
  );
}

export function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      trackPageView({
        page_path: `${location.pathname}${location.search}`,
        page_title: document.title,
        page_location: window.location.href
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  return null;
}
