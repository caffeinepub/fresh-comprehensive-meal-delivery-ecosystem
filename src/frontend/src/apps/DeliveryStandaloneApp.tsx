import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InstallPrompt from "../components/InstallPrompt";
import { markPerformance } from "../lib/performance";

const AccessDenied = lazy(() => import("../components/AccessDenied"));
const DeliveryLoginPrompt = lazy(
  () => import("../components/DeliveryLoginPrompt"),
);
const DeliveryApp = lazy(() => import("../pages/DeliveryApp"));

type CredSession = { role: string; name: string } | null;

function getCredSession(): CredSession {
  try {
    const s = localStorage.getItem("fresh_credential_session");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

function AppSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-16 bg-background border-b" />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </main>
    </div>
  );
}

export default function DeliveryStandaloneApp() {
  const [session, setSession] = useState<CredSession>(getCredSession);

  useEffect(() => {
    markPerformance("delivery-app-mount");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }

    document.title = "Fresh Delivery - Delivery Partner Portal";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", "#3b82f6");

    const onStorage = () => setSession(getCredSession());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!session) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header userType="delivery" />
          <Suspense fallback={<AppSkeleton />}>
            <DeliveryLoginPrompt />
          </Suspense>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  if (session.role !== "delivery") {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Suspense fallback={null}>
          <AccessDenied appName="Delivery Partner" />
        </Suspense>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-delivery-50/30 via-background to-delivery-100/20">
        <Header userType="delivery" />
        <main className="flex-1">
          <Suspense fallback={<AppSkeleton />}>
            <DeliveryApp />
          </Suspense>
        </main>
        <Footer />
        <InstallPrompt appName="Fresh Delivery" appType="delivery" />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
