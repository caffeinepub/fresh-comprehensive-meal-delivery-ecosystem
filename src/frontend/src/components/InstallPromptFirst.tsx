import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptFirstProps {
  appName: string;
  appType: "customer" | "delivery" | "restaurant" | "admin";
  onContinue: () => void;
}

export default function InstallPromptFirst({
  appName,
  appType,
  onContinue,
}: InstallPromptFirstProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Show card immediately — no artificial 1-second delay
  const isInstallable = true;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      sessionStorage.setItem(`pwa-install-first-seen-${appType}`, "true");
      onContinue();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [appType, onContinue]);

  const handleInstallClick = async () => {
    sessionStorage.setItem(`pwa-install-first-seen-${appType}`, "true");
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        await deferredPrompt.userChoice;
      } catch {
        // ignore
      }
      setDeferredPrompt(null);
    }
    onContinue();
  };

  const handleSkip = () => {
    sessionStorage.setItem(`pwa-install-first-seen-${appType}`, "true");
    onContinue();
  };

  if (!isInstallable) {
    return null;
  }

  const gradientClasses = {
    customer: "from-fresh-50 via-background to-fresh-100",
    delivery: "from-blue-50 via-background to-blue-100",
    restaurant: "from-orange-50 via-background to-orange-100",
    admin: "from-slate-50 via-background to-slate-100",
  };

  const buttonClasses = {
    customer: "bg-fresh-600 hover:bg-fresh-700",
    delivery: "bg-blue-600 hover:bg-blue-700",
    restaurant: "bg-orange-600 hover:bg-orange-700",
    admin: "bg-slate-600 hover:bg-slate-700",
  };

  const iconColorClasses = {
    customer: "text-fresh-600",
    delivery: "text-blue-600",
    restaurant: "text-orange-600",
    admin: "text-slate-600",
  };

  const iconBgClasses = {
    customer: "bg-fresh-100",
    delivery: "bg-blue-100",
    restaurant: "bg-orange-100",
    admin: "bg-slate-100",
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gradient-to-br ${gradientClasses[appType]} p-4`}
    >
      <Card className="w-full max-w-md shadow-xl relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8"
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardHeader className="text-center pb-4">
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${iconBgClasses[appType]}`}
          >
            <Smartphone className={`h-10 w-10 ${iconColorClasses[appType]}`} />
          </div>
          <CardTitle className="text-2xl">Install {appName}</CardTitle>
          <CardDescription className="text-base mt-2">
            Get the best experience by installing this app on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${buttonClasses[appType]}`}
              />
              <p>Quick access from your home screen</p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${buttonClasses[appType]}`}
              />
              <p>Works offline with cached data</p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${buttonClasses[appType]}`}
              />
              <p>Native app-like experience</p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${buttonClasses[appType]}`}
              />
              <p>Faster loading and better performance</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleInstallClick}
              className={`w-full ${buttonClasses[appType]} text-white`}
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Install {appName}
            </Button>
            <Button
              variant="outline"
              onClick={handleSkip}
              className="w-full"
              size="lg"
            >
              Continue Without Installing
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            You can always install later from your browser menu
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
