import { useState } from "react";
import AdminStandaloneApp from "./apps/AdminStandaloneApp";
import CustomerStandaloneApp from "./apps/CustomerStandaloneApp";
import DeliveryStandaloneApp from "./apps/DeliveryStandaloneApp";
import RestaurantStandaloneApp from "./apps/RestaurantStandaloneApp";
import AppDirectory from "./components/AppDirectory";

type AppType = "customer" | "delivery" | "restaurant" | "admin" | "directory";

/** Detect app type synchronously from URL — runs once at module init time */
function detectAppType(): AppType {
  try {
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get("app");
    if (
      appParam &&
      ["customer", "delivery", "restaurant", "admin"].includes(appParam)
    ) {
      updateManifest(appParam as AppType);
      return appParam as AppType;
    }

    const hostname = window.location.hostname;
    if (hostname.startsWith("delivery.")) {
      updateManifest("delivery");
      return "delivery";
    }
    if (hostname.startsWith("restaurant.")) {
      updateManifest("restaurant");
      return "restaurant";
    }
    if (hostname.startsWith("admin.")) {
      updateManifest("admin");
      return "admin";
    }
    if (hostname.startsWith("customer.") || hostname.startsWith("app.")) {
      updateManifest("customer");
      return "customer";
    }

    const path = window.location.pathname;
    if (path.startsWith("/delivery")) {
      updateManifest("delivery");
      return "delivery";
    }
    if (path.startsWith("/restaurant")) {
      updateManifest("restaurant");
      return "restaurant";
    }
    if (path.startsWith("/admin")) {
      updateManifest("admin");
      return "admin";
    }
    if (path.startsWith("/customer")) {
      updateManifest("customer");
      return "customer";
    }
  } catch {
    // ignore
  }
  return "directory";
}

function updateManifest(type: AppType): void {
  if (type === "directory") return;
  try {
    const manifestLink = document.getElementById(
      "manifest-link",
    ) as HTMLLinkElement;
    if (manifestLink) manifestLink.href = `/manifest-${type}.json`;
  } catch {
    // ignore
  }
}

// Compute once — no useEffect needed
const initialAppType = detectAppType();

export default function App() {
  // State initialized synchronously — avoids the "directory" flash on first render
  const [appType] = useState<AppType>(initialAppType);

  switch (appType) {
    case "delivery":
      return <DeliveryStandaloneApp />;
    case "restaurant":
      return <RestaurantStandaloneApp />;
    case "admin":
      return <AdminStandaloneApp />;
    case "customer":
      return <CustomerStandaloneApp />;
    default:
      return <AppDirectory />;
  }
}
