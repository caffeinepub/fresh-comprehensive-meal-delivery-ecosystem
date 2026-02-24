import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useOtpAuth } from '../hooks/useOtpAuth';
import { useGetCallerUserProfile, useGetCustomerProfile } from '../hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomerLoginPrompt from '../components/CustomerLoginPrompt';
import CustomerProfileSetup from '../components/CustomerProfileSetup';
import HomePage from '../pages/HomePage';
import InstallPrompt from '../components/InstallPrompt';
import InstallPromptFirst from '../components/InstallPromptFirst';
import { markPerformance, logAppStartup, logPerformanceSummary } from '../lib/performance';

export default function CustomerStandaloneApp() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isAuthenticated: otpAuthenticated } = useOtpAuth();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: customerProfile } = useGetCustomerProfile();
  const [showInstallFirst, setShowInstallFirst] = useState(true);

  const isAuthenticated = !!identity || otpAuthenticated;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    markPerformance('customer-app-mount');

    // Register enhanced service worker with aggressive caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[Customer App] Service Worker v3 registered with aggressive caching');
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Customer App] New service worker available - refresh for updates');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Customer App] Service Worker registration failed:', error);
        });
    }

    // Update HTML metadata for Customer app
    document.title = 'Fresh Customer - Home Cooked Meal Delivery';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#10b981');
    }

    // Log app startup
    logAppStartup('Customer App');

    // Log performance summary after app stabilizes
    const timer = setTimeout(() => {
      logPerformanceSummary();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show install prompt first before anything else
  if (showInstallFirst) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <InstallPromptFirst
          appName="Fresh Customer"
          appType="customer"
          onContinue={() => setShowInstallFirst(false)}
        />
      </ThemeProvider>
    );
  }

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-fresh-50 via-background to-fresh-100">
          <div className="text-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading Fresh Customer App...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header userType="customer" />
          <CustomerLoginPrompt />
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header userType="customer" />
          <CustomerProfileSetup />
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-fresh-50/30 via-background to-fresh-100/20">
        <Header userType="customer" />
        <main className="flex-1">
          <HomePage />
        </main>
        <Footer />
        <InstallPrompt appName="Fresh Customer" appType="customer" />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
