import { useEffect, useState } from "react";
import AdminStandaloneApp from "./apps/AdminStandaloneApp";
import CustomerStandaloneApp from "./apps/CustomerStandaloneApp";
import DeliveryStandaloneApp from "./apps/DeliveryStandaloneApp";
import RestaurantStandaloneApp from "./apps/RestaurantStandaloneApp";
import AppDirectory from "./components/AppDirectory";

export default function App() {
  const [appType, setAppType] = useState<
    "customer" | "delivery" | "restaurant" | "admin" | "directory"
  >("directory");

  useEffect(() => {
    // Detect app type from URL parameter, subdomain, or path
    const params = new URLSearchParams(window.location.search);
    const appParam = params.get("app");

    // Check URL parameter first
    if (
      appParam &&
      ["customer", "delivery", "restaurant", "admin"].includes(appParam)
    ) {
      setAppType(appParam as any);
      updateManifest(appParam as any);
      return;
    }

    // Check subdomain (e.g., delivery.fresh.com, restaurant.fresh.com)
    const hostname = window.location.hostname;
    if (hostname.startsWith("delivery.")) {
      setAppType("delivery");
      updateManifest("delivery");
      return;
    }
    if (hostname.startsWith("restaurant.")) {
      setAppType("restaurant");
      updateManifest("restaurant");
      return;
    }
    if (hostname.startsWith("admin.")) {
      setAppType("admin");
      updateManifest("admin");
      return;
    }
    if (hostname.startsWith("customer.") || hostname.startsWith("app.")) {
      setAppType("customer");
      updateManifest("customer");
      return;
    }

    // Check path (e.g., /delivery, /restaurant, /admin)
    const path = window.location.pathname;
    if (path.startsWith("/delivery")) {
      setAppType("delivery");
      updateManifest("delivery");
      return;
    }
    if (path.startsWith("/restaurant")) {
      setAppType("restaurant");
      updateManifest("restaurant");
      return;
    }
    if (path.startsWith("/admin")) {
      setAppType("admin");
      updateManifest("admin");
      return;
    }
    if (path.startsWith("/customer")) {
      setAppType("customer");
      updateManifest("customer");
      return;
    }

    // Default to directory view
    setAppType("directory");
  }, []);

  const updateManifest = (
    type: "customer" | "delivery" | "restaurant" | "admin",
  ) => {
    const manifestLink = document.getElementById(
      "manifest-link",
    ) as HTMLLinkElement;
    if (manifestLink) {
      manifestLink.href = `/manifest-${type}.json`;
    }
  };

  // Render the appropriate standalone app or directory
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
