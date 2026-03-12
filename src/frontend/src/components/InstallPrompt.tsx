import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptProps {
  appName: string;
  appType: "customer" | "delivery" | "restaurant" | "admin";
}

export default function InstallPrompt({
  appName,
  appType,
}: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem(`pwa-install-dismissed-${appType}`);
    if (dismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [appType]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(`pwa-install-dismissed-${appType}`, "true");
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  const colorClasses = {
    customer: "border-fresh-200 bg-fresh-50/50",
    delivery: "border-blue-200 bg-blue-50/50",
    restaurant: "border-orange-200 bg-orange-50/50",
    admin: "border-slate-200 bg-slate-50/50",
  };

  const buttonClasses = {
    customer: "bg-fresh-600 hover:bg-fresh-700",
    delivery: "bg-blue-600 hover:bg-blue-700",
    restaurant: "bg-orange-600 hover:bg-orange-700",
    admin: "bg-slate-600 hover:bg-slate-700",
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className={`shadow-lg ${colorClasses[appType]}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              <CardTitle className="text-lg">Install {appName}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1 -mr-1"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Install this app on your device for quick access and offline
            functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            onClick={handleInstallClick}
            className={`flex-1 ${buttonClasses[appType]} text-white`}
          >
            <Download className="mr-2 h-4 w-4" />
            Install App
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            Not Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
