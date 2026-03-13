import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InstallPrompt from "../components/InstallPrompt";
import { markPerformance } from "../lib/performance";

const CustomerLoginPrompt = lazy(
  () => import("../components/CustomerLoginPrompt"),
);
const HomePage = lazy(() => import("../pages/HomePage"));

type AuthState =
  | { type: "credential"; data: { name: string; role: string } }
  | { type: "guest"; data: { name: string; isGuest: boolean } }
  | null;

function getAuthState(): AuthState {
  try {
    const cred = localStorage.getItem("fresh_credential_session");
    if (cred) return { type: "credential", data: JSON.parse(cred) };
    const guest = localStorage.getItem("fresh_guest_session");
    if (guest) return { type: "guest", data: JSON.parse(guest) };
  } catch {
    // ignore
  }
  return null;
}

function AppSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-16 bg-background border-b" />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </main>
    </div>
  );
}

export default function CustomerStandaloneApp() {
  const [authState, setAuthState] = useState<AuthState>(getAuthState);

  useEffect(() => {
    markPerformance("customer-app-mount");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }

    document.title = "Fresh Customer - Home Cooked Meal Delivery";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", "#10b981");

    const onStorage = () => setAuthState(getAuthState());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!authState) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header userType="customer" />
          <Suspense fallback={<AppSkeleton />}>
            <CustomerLoginPrompt />
          </Suspense>
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
          <Suspense fallback={<AppSkeleton />}>
            <HomePage />
          </Suspense>
        </main>
        <Footer />
        <InstallPrompt appName="Fresh Customer" appType="customer" />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
