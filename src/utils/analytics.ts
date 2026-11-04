type EventName =
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'login'
  | 'sign_up'
  | 'error_caught';

interface AnalyticsPayload {
  [key: string]: any;
}

export const analytics = {
  track(eventName: EventName, payload?: AnalyticsPayload) {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, payload);
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        if (eventName === 'view_item') (window as any).fbq('track', 'ViewContent', payload);
        else if (eventName === 'add_to_cart') (window as any).fbq('track', 'AddToCart', payload);
        else if (eventName === 'begin_checkout') (window as any).fbq('track', 'InitiateCheckout', payload);
        else if (eventName === 'purchase') (window as any).fbq('track', 'Purchase', payload);
        else (window as any).fbq('trackCustom', eventName, payload);
      }

      if (process.env.NODE_ENV !== 'production') {
        console.info(`[Analytics Event: ${eventName}]`, payload || {});
      }
    } catch (e) {
    }
  },

  captureException(error: Error, componentStack?: string) {
    try {
      console.error('[Error Tracker Caught]:', error, componentStack);

      this.track('error_caught', {
        message: error.message,
        stack: error.stack?.slice(0, 500),
        componentStack: componentStack?.slice(0, 500),
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
      });

      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(error);
      }
    } catch {
    }
  },
};
