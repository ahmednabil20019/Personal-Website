import { createContext, useContext, useEffect, ReactNode } from 'react';

interface AnalyticsEvent {
    name: string;
    properties?: Record<string, any>;
    timestamp: number;
}

interface AnalyticsContextType {
    trackEvent: (name: string, properties?: Record<string, any>) => void;
    trackPageView: (path: string) => void;
    trackClick: (element: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Local storage key for analytics
const ANALYTICS_KEY = 'portfolio_analytics';
const MAX_EVENTS = 500;

// Get stored events
const getStoredEvents = (): AnalyticsEvent[] => {
    try {
        const stored = localStorage.getItem(ANALYTICS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

// Store event
const storeEvent = (event: AnalyticsEvent) => {
    try {
        const events = getStoredEvents();
        events.push(event);
        // Keep only last MAX_EVENTS
        const trimmed = events.slice(-MAX_EVENTS);
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmed));
    } catch (e) {
        console.warn('Failed to store analytics event', e);
    }
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
    // Track page view on mount and route changes
    useEffect(() => {
        trackPageView(window.location.pathname);

        // Listen for popstate (back/forward navigation)
        const handlePopstate = () => {
            trackPageView(window.location.pathname);
        };
        window.addEventListener('popstate', handlePopstate);
        return () => window.removeEventListener('popstate', handlePopstate);
    }, []);

    // Track section visibility with Intersection Observer
    useEffect(() => {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        trackEvent('section_view', {
                            section: entry.target.id,
                            path: window.location.pathname,
                        });
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    const trackEvent = (name: string, properties?: Record<string, any>) => {
        const event: AnalyticsEvent = {
            name,
            properties: {
                ...properties,
                url: window.location.href,
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
            },
            timestamp: Date.now(),
        };

        storeEvent(event);

        // Log in development
        if (import.meta.env.DEV) {
            console.log('📊 Analytics:', name, properties);
        }

        // Here you could also send to an external analytics service
        // Example: sendToExternalService(event);
    };

    const trackPageView = (path: string) => {
        trackEvent('page_view', { path });
    };

    const trackClick = (element: string, properties?: Record<string, any>) => {
        trackEvent('click', { element, ...properties });
    };

    return (
        <AnalyticsContext.Provider value={{ trackEvent, trackPageView, trackClick }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

// Hook to use analytics
export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        // Return no-op functions if not wrapped in provider
        return {
            trackEvent: () => { },
            trackPageView: () => { },
            trackClick: () => { },
        };
    }
    return context;
};

// Export analytics data getter for admin dashboard
export const getAnalyticsData = () => {
    const events = getStoredEvents();

    // Calculate stats
    const pageViews = events.filter(e => e.name === 'page_view').length;
    const sectionViews = events.filter(e => e.name === 'section_view');
    const clicks = events.filter(e => e.name === 'click').length;

    // Section popularity
    const sectionCounts: Record<string, number> = {};
    sectionViews.forEach(e => {
        const section = e.properties?.section || 'unknown';
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
    });

    // Recent events
    const recentEvents = events.slice(-50).reverse();

    // Daily views (last 7 days)
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const dailyViews: { date: string; views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const dayStart = now - (i * dayMs);
        const dayEnd = dayStart + dayMs;
        const views = events.filter(e =>
            e.name === 'page_view' &&
            e.timestamp >= dayStart &&
            e.timestamp < dayEnd
        ).length;
        dailyViews.push({
            date: new Date(dayStart).toLocaleDateString('en-US', { weekday: 'short' }),
            views,
        });
    }

    return {
        totalPageViews: pageViews,
        totalClicks: clicks,
        sectionPopularity: sectionCounts,
        recentEvents,
        dailyViews,
        totalEvents: events.length,
    };
};

// Clear analytics data
export const clearAnalytics = () => {
    localStorage.removeItem(ANALYTICS_KEY);
};
