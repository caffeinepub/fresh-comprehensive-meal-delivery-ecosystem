const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BookingFlow-CsRRHtsG.js","assets/index-BfIGtKmp.js","assets/index-wG850Y47.css","assets/input-Cv-sn70i.js","assets/label-CvVyz3q6.js","assets/radio-group-nkxddeZc.js","assets/index-B9ZzXqza.js","assets/textarea-DATyN0LN.js","assets/useQueries-BReyyw8I.js","assets/useActor-ClP9Ae-Z.js","assets/DistanceCalculator-BGQpQGtS.js","assets/dialog-DWLsUv_A.js","assets/map-pin-DDrx7xfO.js","assets/loader-circle-DnbbqiBo.js","assets/clock-BDHWbZMx.js","assets/calendar-Cd_UEZVC.js","assets/phone-y6Iqopgb.js","assets/check-DZsTBaVH.js","assets/MealPlanFlow-X5Mwpdf_.js","assets/badge-D8WDHAry.js","assets/BookingsView-Cz_IVLRu.js","assets/pinUtils-Cv27Ljgl.js","assets/OrdersView-Cb1whYlq.js","assets/package-BfaQt1xr.js"])))=>i.map(i=>d[i]);
import { r as reactExports, j as jsxRuntimeExports, B as Button, C as Card, a as CardHeader, b as CardTitle, e as CardContent, U as UtensilsCrossed, d as CardDescription, _ as __vitePreload } from "./index-BfIGtKmp.js";
import { d as useGetDabbaBookings, e as useGetCustomerOrders, D as DabbaStatusEnum, O as OrderStatusEnum } from "./useQueries-BReyyw8I.js";
import { C as Calendar } from "./calendar-Cd_UEZVC.js";
import { P as Package } from "./package-BfaQt1xr.js";
import { P as Plus } from "./plus-C1K47GTK.js";
import "./useActor-ClP9Ae-Z.js";
const BookingFlow = reactExports.lazy(() => __vitePreload(() => import("./BookingFlow-CsRRHtsG.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]) : void 0));
const MealPlanFlow = reactExports.lazy(() => __vitePreload(() => import("./MealPlanFlow-X5Mwpdf_.js"), true ? __vite__mapDeps([18,1,2,19,3,4,5,6,8,9,15]) : void 0));
const BookingsView = reactExports.lazy(() => __vitePreload(() => import("./BookingsView-Cz_IVLRu.js"), true ? __vite__mapDeps([20,1,2,19,11,3,4,6,17,21,8,9,15,12,14,13]) : void 0));
const OrdersView = reactExports.lazy(() => __vitePreload(() => import("./OrdersView-Cb1whYlq.js"), true ? __vite__mapDeps([22,1,2,19,11,4,7,8,9,23]) : void 0));
function LoadingFallback() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading..." })
  ] }) });
}
function HomePage() {
  const [currentView, setCurrentView] = reactExports.useState("home");
  const prefetchedRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const { data: bookings = [] } = useGetDabbaBookings();
  const { data: orders = [] } = useGetCustomerOrders();
  const todayBookings = bookings.filter(
    (b) => b.status === DabbaStatusEnum.pending || b.status === DabbaStatusEnum.pickedUp
  );
  const activeOrders = orders.filter(
    (o) => o.status !== OrderStatusEnum.delivered && o.status !== OrderStatusEnum.cancelled
  );
  reactExports.useEffect(() => {
    const prefetch = (view, factory, delay) => {
      const t = setTimeout(() => {
        if (!prefetchedRef.current.has(view)) {
          factory().then(() => {
            prefetchedRef.current.add(view);
          }).catch(() => {
          });
        }
      }, delay);
      return t;
    };
    const t1 = prefetch(
      "booking",
      () => __vitePreload(() => import("./BookingFlow-CsRRHtsG.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]) : void 0),
      800
    );
    const t2 = prefetch(
      "mealPlan",
      () => __vitePreload(() => import("./MealPlanFlow-X5Mwpdf_.js"), true ? __vite__mapDeps([18,1,2,19,3,4,5,6,8,9,15]) : void 0),
      1600
    );
    const t3 = prefetch(
      "bookings",
      () => __vitePreload(() => import("./BookingsView-Cz_IVLRu.js"), true ? __vite__mapDeps([20,1,2,19,11,3,4,6,17,21,8,9,15,12,14,13]) : void 0),
      2400
    );
    const t4 = prefetch(
      "orders",
      () => __vitePreload(() => import("./OrdersView-Cb1whYlq.js"), true ? __vite__mapDeps([22,1,2,19,11,4,7,8,9,23]) : void 0),
      3200
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);
  if (currentView === "booking") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      BookingFlow,
      {
        onComplete: () => setCurrentView("home"),
        onCancel: () => setCurrentView("home")
      }
    ) });
  }
  if (currentView === "mealPlan") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MealPlanFlow,
      {
        onComplete: () => setCurrentView("home"),
        onCancel: () => setCurrentView("home")
      }
    ) });
  }
  if (currentView === "bookings") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentView("home"),
          "data-ocid": "home.back.button",
          children: "← Back to Home"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-6", children: "My Bookings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookingsView, {}) })
    ] });
  }
  if (currentView === "orders") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-4xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setCurrentView("home"),
          "data-ocid": "home.back.button",
          children: "← Back to Home"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-6", children: "My Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersView, {}) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-6xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-2", children: "Welcome to Fresh" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground", children: "Your daily home-cooked meal service" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-fresh-600" }),
          "Today's Bookings"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-fresh-600", children: todayBookings.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Active dabba pickups" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-fresh-600" }),
          "Active Orders"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-fresh-600", children: activeOrders.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Meals in progress" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-5 w-5 text-fresh-600" }),
          "Total Orders"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-fresh-600", children: orders.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All time" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "hover:shadow-lg transition-shadow cursor-pointer",
          onClick: () => setCurrentView("booking"),
          "data-ocid": "home.booking.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-fresh-600" }),
                "Book Dabba Pickup"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Schedule daily pickup from home to office" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", "data-ocid": "home.booking.primary_button", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "New Booking"
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "hover:shadow-lg transition-shadow cursor-pointer",
          onClick: () => setCurrentView("mealPlan"),
          "data-ocid": "home.mealplan.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-6 w-6 text-fresh-600" }),
                "Order Meals"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Browse and subscribe to meal plans" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full", "data-ocid": "home.mealplan.primary_button", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
              "Browse Meals"
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent Bookings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Your latest dabba pickups" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: bookings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-muted-foreground",
            "data-ocid": "home.bookings.empty_state",
            children: "No bookings yet"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          bookings.slice(0, 3).map((booking, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between p-2 border rounded",
              "data-ocid": `home.bookings.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: booking.pickupAddress }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground capitalize", children: booking.status })
              ]
            },
            booking.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "link",
              onClick: () => setCurrentView("bookings"),
              className: "w-full",
              "data-ocid": "home.bookings.link",
              children: "View All Bookings"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Your latest meal orders" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-muted-foreground",
            "data-ocid": "home.orders.empty_state",
            children: "No orders yet"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          orders.slice(0, 3).map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between p-2 border rounded",
              "data-ocid": `home.orders.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                  "Order #",
                  order.id.slice(0, 8)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground capitalize", children: order.status })
              ]
            },
            order.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "link",
              onClick: () => setCurrentView("orders"),
              className: "w-full",
              "data-ocid": "home.orders.link",
              children: "View All Orders"
            }
          )
        ] }) })
      ] })
    ] })
  ] });
}
export {
  HomePage as default
};
