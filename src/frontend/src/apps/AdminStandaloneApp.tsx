import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useOtpAuth } from '../hooks/useOtpAuth';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminLoginPrompt from '../components/AdminLoginPrompt';
import AdminProfileSetup from '../components/AdminProfileSetup';
import AdminApp from '../pages/AdminApp';
import InstallPrompt from '../components/InstallPrompt';
import InstallPromptFirst from '../components/InstallPromptFirst';
import { markPerformance, logAppStartup, logPerformanceSummary } from '../lib/performance';

export default function AdminStandaloneApp() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isAuthenticated: otpAuthenticated } = useOtpAuth();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [showInstallFirst, setShowInstallFirst] = useState(true);

  const isAuthenticated = !!identity || otpAuthenticated;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    markPerformance('admin-app-mount');

    // Register enhanced service worker with aggressive caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[Admin App] Service Worker v3 registered with aggressive caching');
          
          setInterval(() => {
            registration.update();
          }, 60000);
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Admin App] New service worker available - refresh for updates');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Admin App] Service Worker registration failed:', error);
        });
    }

    document.title = 'Fresh Admin - Platform Administration';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#64748b');
    }

    logAppStartup('Admin App');

    const timer = setTimeout(() => {
      logPerformanceSummary();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showInstallFirst) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <InstallPromptFirst
          appName="Fresh Admin"
          appType="admin"
          onContinue={() => setShowInstallFirst(false)}
        />
      </ThemeProvider>
    );
  }

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-admin-50 via-background to-admin-100">
          <div className="text-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-admin-600 border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading Fresh Admin App...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header userType="admin" />
          <AdminLoginPrompt />
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
          <Header userType="admin" />
          <AdminProfileSetup />
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-admin-50/30 via-background to-admin-100/20">
        <Header userType="admin" />
        <main className="flex-1">
          <AdminApp />
        </main>
        <Footer />
        <InstallPrompt appName="Fresh Admin" appType="admin" />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
