import { c as createLucideIcon, r as reactExports, P as PickupSlotEnum, S as SubscriptionTypeEnum, u as useCreateDabbaBooking, j as jsxRuntimeExports, C as Card, a as CardHeader, b as CardTitle, d as CardDescription, e as CardContent, L as Label, M as MapPin, I as Input, B as Button, f as LoaderCircle, g as Clock, h as Calendar, i as Phone, k as ue } from "./index-CJ4HkvNi.js";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-Dt48wGdr.js";
import { C as Check } from "./check-BtbqnzM-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    { headers: { "Accept-Language": "en" } }
  );
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  return data.display_name;
}
function BookingFlow({
  onComplete,
  onCancel
}) {
  const [step, setStep] = reactExports.useState(1);
  const [pickupAddress, setPickupAddress] = reactExports.useState("");
  const [dropAddress, setDropAddress] = reactExports.useState("");
  const [pickupGps, setPickupGps] = reactExports.useState(false);
  const [dropGps, setDropGps] = reactExports.useState(false);
  const [loadingPickup, setLoadingPickup] = reactExports.useState(false);
  const [loadingDrop, setLoadingDrop] = reactExports.useState(false);
  const [slotTime, setSlotTime] = reactExports.useState(
    PickupSlotEnum.morning
  );
  const [frequency, setFrequency] = reactExports.useState(
    SubscriptionTypeEnum.daily
  );
  const createBooking = useCreateDabbaBooking();
  const handleUseLocation = (field) => {
    const setLoading = field === "pickup" ? setLoadingPickup : setLoadingDrop;
    const setAddress = field === "pickup" ? setPickupAddress : setDropAddress;
    const setGps = field === "pickup" ? setPickupGps : setDropGps;
    if (!navigator.geolocation) {
      ue.error("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
          setAddress(address);
          setGps(true);
        } catch {
          ue.error("Could not fetch address. Please enter it manually.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        ue.error(
          "Location permission denied. Please enter address manually."
        );
        setLoading(false);
      },
      { timeout: 1e4 }
    );
  };
  const handleNext = () => {
    if (step === 1 && (!pickupAddress || !dropAddress)) {
      ue.error("Please fill in both addresses");
      return;
    }
    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };
  const handleSubmit = async () => {
    try {
      await createBooking.mutateAsync({
        pickupAddress,
        dropAddress,
        slotTime,
        frequency
      });
      ue.success("Booking created successfully!");
      onComplete();
    } catch (_error) {
      ue.error("Failed to create booking");
    }
  };
  const totalSteps = 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-2xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Book Dabba Pickup" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
        "Step ",
        step,
        " of ",
        totalSteps
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "pickup", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "inline h-4 w-4 mr-2" }),
            "Pickup Address (Home / Hotel)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "pickup",
                "data-ocid": "booking.input",
                placeholder: "Enter your home or hotel address",
                value: pickupAddress,
                onChange: (e) => {
                  setPickupAddress(e.target.value);
                  setPickupGps(false);
                },
                className: pickupGps ? "pr-8" : ""
              }
            ),
            pickupGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: loadingPickup,
              onClick: () => handleUseLocation("pickup"),
              "data-ocid": "booking.pickup_location_button",
              className: "flex items-center gap-2",
              children: [
                loadingPickup ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
                loadingPickup ? "Fetching location..." : "Use my location"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "drop", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "inline h-4 w-4 mr-2" }),
            "Drop Address"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "drop",
                "data-ocid": "booking.textarea",
                placeholder: "Enter your drop/delivery address",
                value: dropAddress,
                onChange: (e) => {
                  setDropAddress(e.target.value);
                  setDropGps(false);
                },
                className: dropGps ? "pr-8" : ""
              }
            ),
            dropGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              disabled: loadingDrop,
              onClick: () => handleUseLocation("drop"),
              "data-ocid": "booking.drop_location_button",
              className: "flex items-center gap-2",
              children: [
                loadingDrop ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
                loadingDrop ? "Fetching location..." : "Use my location"
              ]
            }
          )
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "inline h-4 w-4 mr-2" }),
            "Pickup Time Slot"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            RadioGroup,
            {
              value: slotTime,
              onValueChange: (value) => setSlotTime(value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: PickupSlotEnum.morning,
                      id: "morning"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "morning", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Morning Slot" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "8:00 AM - 10:00 AM" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: PickupSlotEnum.midMorning,
                      id: "midMorning"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "midMorning",
                      className: "flex-1 cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Mid-Morning Slot" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "10:00 AM - 12:00 PM" })
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "inline h-4 w-4 mr-2" }),
            "Frequency"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            RadioGroup,
            {
              value: frequency,
              onValueChange: (value) => setFrequency(value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: SubscriptionTypeEnum.daily,
                      id: "daily"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "daily", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Daily" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Monday to Friday" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: SubscriptionTypeEnum.weekly,
                      id: "weekly"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "weekly", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Weekly" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Select specific days" })
                  ] })
                ] })
              ]
            }
          )
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800",
            "data-ocid": "booking.panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-5 w-5 shrink-0 mt-0.5 text-blue-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-blue-900", children: "Fare will be calculated by our team" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-700", children: "The distance and fare for your booking will be verified and set by our admin team after you submit. You will be notified of the final fare before delivery begins." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 text-blue-700", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Questions? Contact customer care or reach out to our admin." })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted rounded-lg space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Booking Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
              "Pickup Address",
              pickupGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-green-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: pickupAddress })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
              "Drop Address",
              dropGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-green-500" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: dropAddress })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Time Slot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: slotTime === PickupSlotEnum.morning ? "8:00 AM - 10:00 AM" : "10:00 AM - 12:00 PM" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", children: frequency })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Fare" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold text-muted-foreground italic", children: "To be confirmed by admin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        step > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handleBack,
            className: "flex-1",
            "data-ocid": "booking.cancel_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }),
              "Back"
            ]
          }
        ),
        step < totalSteps ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleNext,
            className: "flex-1",
            "data-ocid": "booking.primary_button",
            children: [
              "Next",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-2" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSubmit,
            disabled: createBooking.isPending,
            className: "flex-1",
            "data-ocid": "booking.submit_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 mr-2" }),
              createBooking.isPending ? "Confirming..." : "Confirm Booking"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            onClick: onCancel,
            "data-ocid": "booking.close_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  BookingFlow as default
};
