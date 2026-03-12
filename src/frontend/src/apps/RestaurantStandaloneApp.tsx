import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import AccessDenied from "../components/AccessDenied";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InstallPrompt from "../components/InstallPrompt";
import InstallPromptFirst from "../components/InstallPromptFirst";
import RestaurantLoginPrompt from "../components/RestaurantLoginPrompt";
import RestaurantProfileSetup from "../components/RestaurantProfileSetup";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useOtpAuth } from "../hooks/useOtpAuth";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import {
  logAppStartup,
  logPerformanceSummary,
  markPerformance,
} from "../lib/performance";
import RestaurantApp from "../pages/RestaurantApp";

export default function RestaurantStandaloneApp() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isAuthenticated: otpAuthenticated } = useOtpAuth();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const [showInstallFirst, setShowInstallFirst] = useState(true);

  const isAuthenticated = !!identity || otpAuthenticated;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const hasCorrectRole = !userProfile || userProfile.userType === "restaurant";

  useEffect(() => {
    markPerformance("restaurant-app-mount");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          setInterval(() => {
            registration.update();
          }, 60000);
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("[Restaurant App] New service worker available");
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error(
            "[Restaurant App] Service Worker registration failed:",
            error,
          );
        });
    }

    document.title = "Fresh Restaurant - Restaurant Partner Portal";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", "#f97316");

    logAppStartup("Restaurant App");
    const timer = setTimeout(() => {
      logPerformanceSummary();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showInstallFirst) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <InstallPromptFirst
          appName="Fresh Restaurant"
          appType="restaurant"
          onContinue={() => setShowInstallFirst(false)}
        />
      </ThemeProvider>
    );
  }

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-restaurant-50 via-background to-restaurant-100">
          <div className="text-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-restaurant-600 border-t-transparent mx-auto" />
            <p className="text-muted-foreground">
              Loading Fresh Restaurant App...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header userType="restaurant" />
          <RestaurantLoginPrompt />
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
          <Header userType="restaurant" />
          <RestaurantProfileSetup />
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Role-based access control: block non-restaurants
  if (
    isAuthenticated &&
    !profileLoading &&
    isFetched &&
    userProfile &&
    !hasCorrectRole
  ) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AccessDenied appName="Restaurant Partner" />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-restaurant-50/30 via-background to-restaurant-100/20">
        <Header userType="restaurant" />
        <main className="flex-1">
          <RestaurantApp />
        </main>
        <Footer />
        <InstallPrompt appName="Fresh Restaurant" appType="restaurant" />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
