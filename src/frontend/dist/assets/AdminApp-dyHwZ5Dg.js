import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, C as Card, a as CardHeader, b as CardTitle, d as CardDescription, e as CardContent, U as UtensilsCrossed, B as Button, f as ue, g as getAllCredentialUsers, T as Truck, D as Download, h as adminUpdatePassword } from "./index-BfIGtKmp.js";
import { B as Badge } from "./badge-D8WDHAry.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-DWLsUv_A.js";
import { I as Input } from "./input-Cv-sn70i.js";
import { L as Label } from "./label-CvVyz3q6.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D-ln3Msz.js";
import { g as getStoredAllFareRates, s as saveAllFareRates } from "./DistanceCalculator-BGQpQGtS.js";
import { P as Package } from "./package-BfaQt1xr.js";
import { A as Alert, b as CircleCheck, a as AlertDescription, C as CircleAlert, U as Users, K as KeyRound } from "./alert-D6deBIqq.js";
import { u as useActor } from "./useActor-ClP9Ae-Z.js";
import { L as LoaderCircle } from "./loader-circle-DnbbqiBo.js";
import { u as useGetAllCustomers, a as useGetAllRestaurants, b as useGetAllDeliveryPartners, c as useGetAllOrders, d as useGetDabbaBookings } from "./useQueries-BReyyw8I.js";
import { D as DollarSign } from "./dollar-sign-BVX9HEee.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7", key: "ztvudi" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4", key: "2ebpfo" }],
  ["path", { d: "M2 7h20", key: "1fcdvo" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
      key: "6c3vgh"
    }
  ]
];
const Store = createLucideIcon("store", __iconNode);
function FareEditor({
  rates,
  onChange
}) {
  const extraKm = Math.max(0, 5 - rates.freeKm);
  const previewFare = Math.max(
    rates.minFare,
    rates.baseFare + extraKm * rates.perKmRate
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Base Fare (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: "0",
            step: "1",
            value: rates.baseFare,
            onChange: (e) => onChange({ ...rates, baseFare: Number(e.target.value) || 0 }),
            "data-ocid": "fare.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Fixed charge per booking" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Free Distance (km)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: "0",
            step: "0.5",
            value: rates.freeKm,
            onChange: (e) => onChange({ ...rates, freeKm: Number(e.target.value) || 0 }),
            "data-ocid": "fare.secondary_button"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "km included in base fare" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Per Km Rate (₹/km)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: "0",
            step: "0.5",
            value: rates.perKmRate,
            onChange: (e) => onChange({ ...rates, perKmRate: Number(e.target.value) || 0 }),
            "data-ocid": "fare.cancel_button"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Charge per km after free distance" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Minimum Fare (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: "0",
            step: "1",
            value: rates.minFare,
            onChange: (e) => onChange({ ...rates, minFare: Number(e.target.value) || 0 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Floor price" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted p-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Fare Preview (5 km trip)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "Base fare (first ",
          rates.freeKm,
          " km)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "₹",
          rates.baseFare
        ] })
      ] }),
      extraKm > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          extraKm,
          " km × ₹",
          rates.perKmRate,
          "/km"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "₹",
          (extraKm * rates.perKmRate).toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold border-t pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Estimated Total" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "₹",
          previewFare.toFixed(2)
        ] })
      ] })
    ] })
  ] });
}
function FareRatesManager() {
  const [allRates, setAllRates] = reactExports.useState(
    getStoredAllFareRates()
  );
  const [saving, setSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAllRates(getStoredAllFareRates());
  }, []);
  const handleSave = () => {
    setSaving(true);
    saveAllFareRates(allRates);
    setTimeout(() => {
      setSaving(false);
      ue.success("Fare rates updated successfully");
    }, 400);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-5 w-5" }),
        "Fare Rate Management"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Set pricing rules for each order type. Changes apply immediately to all new bookings." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "dabbawala", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "dabbawala", "data-ocid": "fare.dabbawala.tab", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 mr-2" }),
            "Dabbawala Orders"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "restaurant", "data-ocid": "fare.restaurant.tab", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-4 w-4 mr-2" }),
            "Restaurant Orders"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "dabbawala", className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Dabbawala:" }),
            " ₹",
            allRates.dabbawala.baseFare,
            " base fare includes first ",
            allRates.dabbawala.freeKm,
            " km, then ₹",
            allRates.dabbawala.perKmRate,
            "/km"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FareEditor,
            {
              rates: allRates.dabbawala,
              onChange: (r) => setAllRates({ ...allRates, dabbawala: r })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "restaurant", className: "pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Restaurant:" }),
            " ₹",
            allRates.restaurant.baseFare,
            " base fare includes first ",
            allRates.restaurant.freeKm,
            " km, then ₹",
            allRates.restaurant.perKmRate,
            "/km"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FareEditor,
            {
              rates: allRates.restaurant,
              onChange: (r) => setAllRates({ ...allRates, restaurant: r })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": "fare.save_button",
          onClick: handleSave,
          disabled: saving,
          className: "w-full md:w-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
            saving ? "Saving..." : "Save Fare Rates"
          ]
        }
      )
    ] })
  ] });
}
function TwilioConfig() {
  const { actor } = useActor();
  const [isConfigured, setIsConfigured] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [accountSid, setAccountSid] = reactExports.useState(
    "AC57ded10611d2c9e54b65c84d8b034f1a"
  );
  const [authToken, setAuthToken] = reactExports.useState(
    "1d8dbe0a7cce1c23130ca03f55736f88"
  );
  const [fromNumber, setFromNumber] = reactExports.useState("+18303594849");
  reactExports.useEffect(() => {
    checkTwilioStatus();
  }, [actor]);
  const checkTwilioStatus = async () => {
    if (!actor) return;
    try {
      const configured = await actor.isTwilioConfigured();
      setIsConfigured(configured);
    } catch (error) {
      console.error("Failed to check Twilio status:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveConfiguration = async (e) => {
    e.preventDefault();
    if (!actor) {
      ue.error("Backend connection unavailable");
      return;
    }
    if (!accountSid || !authToken || !fromNumber) {
      ue.error("All fields are required");
      return;
    }
    setIsSaving(true);
    try {
      const config = {
        accountSid,
        authToken,
        fromNumber
      };
      await actor.setTwilioConfiguration(config);
      setIsConfigured(true);
      ue.success("Twilio SMS service activated!", {
        description: "Phone OTP login is now available across all Fresh apps."
      });
    } catch (error) {
      console.error("Failed to save Twilio configuration:", error);
      ue.error("Failed to save configuration", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }),
        "Twilio SMS Configuration"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-admin-600" }) }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }),
        "Twilio SMS Configuration"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure Twilio credentials to enable phone OTP login across all Fresh apps" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      isConfigured ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-green-200 bg-green-50 dark:bg-green-950/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-green-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-green-900 dark:text-green-100", children: "Twilio SMS service is active. Phone OTP login is enabled for all apps." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: "Twilio SMS is not configured. Phone OTP login will not work until configured." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveConfiguration, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "accountSid", children: "Twilio Account SID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "accountSid",
              type: "text",
              placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
              value: accountSid,
              onChange: (e) => setAccountSid(e.target.value),
              required: true,
              disabled: isSaving
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your Twilio Account SID from the Twilio Console" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "authToken", children: "Twilio Auth Token" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "authToken",
              type: "password",
              placeholder: "Your Twilio Auth Token",
              value: authToken,
              onChange: (e) => setAuthToken(e.target.value),
              required: true,
              disabled: isSaving
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your Twilio Auth Token (keep this secret)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fromNumber", children: "Twilio Phone Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "fromNumber",
              type: "tel",
              placeholder: "+1234567890",
              value: fromNumber,
              onChange: (e) => setFromNumber(e.target.value),
              required: true,
              disabled: isSaving
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your Twilio phone number (must include country code, e.g., +1)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isSaving, className: "w-full", children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
          "Saving Configuration..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
          isConfigured ? "Update Configuration" : "Activate Twilio SMS"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold mb-2 text-sm", children: "Configuration Details:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• Account SID: ",
            accountSid || "Not set"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• From Number: ",
            fromNumber || "Not set"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            "• Status: ",
            isConfigured ? "Active ✓" : "Inactive"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "bg-blue-50 dark:bg-blue-950/20 border-blue-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Note:" }),
        " Once configured, all Fresh apps (Customer, Delivery, Restaurant, Admin) will be able to send SMS verification codes for phone number login. Make sure your Twilio account has sufficient credits and the phone number is verified."
      ] }) })
    ] })
  ] });
}
function ResetPasswordDialog({ user }) {
  const [open, setOpen] = reactExports.useState(false);
  const [newPass, setNewPass] = reactExports.useState("");
  const handleReset = () => {
    if (!newPass.trim()) {
      ue.error("Enter a new password");
      return;
    }
    const ok = adminUpdatePassword(user.username, newPass.trim());
    if (ok) {
      ue.success(`Password updated for ${user.username}`);
      setOpen(false);
      setNewPass("");
    } else {
      ue.error("Failed to update password");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        "data-ocid": "admin.users.open_modal_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-3 w-3 mr-1" }),
          "Reset Password"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "admin.users.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Reset Password for ",
        user.username
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-pass", children: "New Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "new-pass",
              type: "text",
              placeholder: "Enter new password",
              value: newPass,
              onChange: (e) => setNewPass(e.target.value),
              "data-ocid": "admin.users.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The user will need to use this new password to login." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setOpen(false),
            "data-ocid": "admin.users.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleReset, "data-ocid": "admin.users.confirm_button", children: "Update Password" })
      ] })
    ] })
  ] });
}
function AdminApp() {
  const { data: customers = [] } = useGetAllCustomers();
  const { data: restaurants = [] } = useGetAllRestaurants();
  const { data: deliveryPartners = [] } = useGetAllDeliveryPartners();
  const { data: orders = [] } = useGetAllOrders();
  const { data: dabbaBookings = [] } = useGetDabbaBookings();
  const [credUsers, setCredUsers] = reactExports.useState(
    () => getAllCredentialUsers()
  );
  reactExports.useEffect(() => {
    const refresh = () => setCredUsers(getAllCredentialUsers());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0
  );
  const activeRestaurants = restaurants.filter((r) => r.active).length;
  const availablePartners = deliveryPartners.filter((p) => p.available).length;
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      ue.error("No data to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(
        (row) => headers.map((header) => {
          const value = row[header];
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(",")
      )
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ue.success("Data exported successfully");
  };
  const handleExportCustomers = () => {
    const data = customers.map((c) => ({
      ID: c.id.toString(),
      Name: c.name,
      Address: c.address,
      "Wallet Balance": c.walletBalance.toString()
    }));
    exportToCSV(data, "customers");
  };
  const handleExportOrders = () => {
    const data = orders.map((o) => ({
      "Order ID": o.id,
      "Customer ID": o.customerId.toString(),
      "Restaurant ID": o.restaurantId.toString(),
      "Meal ID": o.mealId,
      Quantity: o.quantity.toString(),
      "Total Price": o.totalPrice.toString(),
      Status: o.status,
      "Delivery Status": o.deliveryStatus
    }));
    exportToCSV(data, "orders");
  };
  const handleExportRestaurants = () => {
    const data = restaurants.map((r) => ({
      ID: r.id.toString(),
      Name: r.name,
      Description: r.description,
      "Operating Hours": r.operatingHours,
      Active: r.active ? "Yes" : "No"
    }));
    exportToCSV(data, "restaurants");
  };
  const roleBadgeColor = (role) => {
    if (role === "customer") return "default";
    if (role === "delivery") return "secondary";
    return "outline";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-7xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-2", children: "Admin Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground", children: "Platform management and analytics" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-admin-600" }),
          "Customers"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-admin-600", children: customers.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total registered" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-admin-600" }),
          "Restaurants"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-admin-600", children: activeRestaurants }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Active partners" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-5 w-5 text-admin-600" }),
          "Delivery Partners"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-admin-600", children: availablePartners }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Available now" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-admin-600" }),
          "Total Revenue"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-admin-600", children: [
            "₹",
            totalRevenue
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All time" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "customers", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "customers", "data-ocid": "admin.customers.tab", children: "Customers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "restaurants", "data-ocid": "admin.restaurants.tab", children: "Restaurants" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "delivery", "data-ocid": "admin.delivery.tab", children: "Delivery" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "orders", "data-ocid": "admin.orders.tab", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "bookings", "data-ocid": "admin.bookings.tab", children: "Bookings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "users", "data-ocid": "admin.users.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 mr-1" }),
          "Users"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "fares", "data-ocid": "admin.fares.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-4 w-4 mr-1" }),
          "Fares"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "settings", "data-ocid": "admin.settings.tab", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 mr-2" }),
          "Settings"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "customers", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Customer Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleExportCustomers,
              variant: "outline",
              "data-ocid": "admin.customers.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export to CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "admin.customers.list", children: customers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "admin.customers.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-muted-foreground", children: "No customers registered yet" }) }) : customers.map((customer, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            "data-ocid": `admin.customers.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: customer.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: customer.address })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  "Wallet: ₹",
                  customer.walletBalance.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "ID: ",
                  customer.id.toString().slice(0, 10),
                  "..."
                ] })
              ] }) })
            ]
          },
          customer.id.toString()
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "restaurants", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Restaurant Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleExportRestaurants,
              variant: "outline",
              "data-ocid": "admin.restaurants.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export to CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: restaurants.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "admin.restaurants.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-muted-foreground", children: "No restaurants registered yet" }) }) : restaurants.map((restaurant, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            "data-ocid": `admin.restaurants.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: restaurant.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: restaurant.active ? "default" : "secondary",
                      children: restaurant.active ? "Active" : "Inactive"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: restaurant.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: restaurant.operatingHours }) }) })
            ]
          },
          restaurant.id.toString()
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "delivery", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Delivery Partner Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: deliveryPartners.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "admin.delivery.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-muted-foreground", children: "No delivery partners registered yet" }) }) : deliveryPartners.map((partner, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            "data-ocid": `admin.delivery.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: partner.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: partner.available ? "default" : "secondary",
                    children: partner.available ? "Available" : "Offline"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  "Earnings: ₹",
                  partner.totalEarnings.toString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  "Deliveries: ",
                  partner.deliveryCount.toString()
                ] })
              ] }) })
            ]
          },
          partner.id.toString()
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "orders", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Order Management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleExportOrders,
              variant: "outline",
              "data-ocid": "admin.orders.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export to CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "admin.orders.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-muted-foreground", children: "No orders placed yet" }) }) : orders.map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": `admin.orders.item.${i + 1}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg", children: [
              "Order #",
              order.id.slice(0, 8)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: order.status })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Quantity:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: order.quantity.toString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                "₹",
                order.totalPrice.toString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Delivery Status:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: order.deliveryStatus })
            ] })
          ] }) })
        ] }, order.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "bookings", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Dabba Bookings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                if (dabbaBookings.length === 0) {
                  ue.error("No bookings to export");
                  return;
                }
                const data = dabbaBookings.map((b) => {
                  var _a, _b;
                  return {
                    "Booking ID": b.id,
                    Customer: b.customerIdentifier || ((_b = (_a = b.customerId) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a)) || "II User",
                    Pickup: b.pickupAddress,
                    Drop: b.dropAddress,
                    Slot: b.slotTime,
                    Frequency: b.frequency,
                    Status: b.status
                  };
                });
                exportToCSV(data, "dabba-bookings");
              },
              variant: "outline",
              "data-ocid": "admin.bookings.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", "data-ocid": "admin.bookings.list", children: dabbaBookings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "admin.bookings.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-muted-foreground", children: "No bookings placed yet" }) }) : dabbaBookings.map((booking, i) => {
          var _a, _b;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              "data-ocid": `admin.bookings.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg", children: [
                      "Booking #",
                      booking.id.slice(0, 8)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { children: booking.status })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
                    "Customer:",
                    " ",
                    booking.customerIdentifier || (((_b = (_a = booking.customerId) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a)) ? `${booking.customerId.toString().slice(0, 12)}...` : "II User")
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Pickup:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right max-w-[60%]", children: booking.pickupAddress })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Drop:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right max-w-[60%]", children: booking.dropAddress })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Slot:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: booking.slotTime })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Frequency:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: booking.frequency })
                  ] })
                ] }) })
              ]
            },
            booking.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "users", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Registered Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => {
                const data = credUsers.map((u) => ({
                  Username: u.username,
                  Name: u.name,
                  Phone: u.phone,
                  Role: u.role,
                  Password: u.password
                }));
                exportToCSV(data, "fresh-users");
              },
              "data-ocid": "admin.users.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All users who registered via phone. You can reset their passwords if they forget." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", "data-ocid": "admin.users.list", children: credUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": "admin.users.empty_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 text-center text-muted-foreground", children: "No registered users yet" }) }) : credUsers.map((user, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { "data-ocid": `admin.users.item.${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: roleBadgeColor(user.role),
                  className: "capitalize text-xs",
                  children: user.role
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: user.username }),
              " ",
              "· ",
              user.phone
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Password:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: user.password })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ResetPasswordDialog, { user })
        ] }) }) }, user.userId)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "fares", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-4", children: "Fare Rate Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FareRatesManager, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "settings", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold mb-4", children: "System Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TwilioConfig, {})
      ] })
    ] })
  ] });
}
export {
  AdminApp as default
};
