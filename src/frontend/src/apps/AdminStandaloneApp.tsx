import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import InstallPrompt from "../components/InstallPrompt";
import { markPerformance } from "../lib/performance";

const AdminLoginPrompt = lazy(() => import("../components/AdminLoginPrompt"));
const AdminApp = lazy(() => import("../pages/AdminApp"));

const ADMIN_PASSWORD_KEY = "fresh_admin_password_auth";

function AppSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="h-16 bg-background border-b" />
      <main className="flex-1 container mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-48 rounded-xl" />
      </main>
    </div>
  );
}

export default function AdminStandaloneApp() {
  const [adminPasswordAuth, setAdminPasswordAuth] = useState(
    () => localStorage.getItem(ADMIN_PASSWORD_KEY) === "true",
  );

  useEffect(() => {
    markPerformance("admin-app-mount");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }

    document.title = "Fresh Admin - Platform Administration";
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute("content", "#64748b");

    const check = () => {
      setAdminPasswordAuth(localStorage.getItem(ADMIN_PASSWORD_KEY) === "true");
    };
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  if (!adminPasswordAuth) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header userType="admin" />
          <Suspense fallback={<AppSkeleton />}>
            <AdminLoginPrompt />
          </Suspense>
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
          <Suspense fallback={<AppSkeleton />}>
            <AdminApp />
          </Suspense>
        </main>
        <Footer />
        <InstallPrompt appName="Fresh Admin" appType="admin" />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
