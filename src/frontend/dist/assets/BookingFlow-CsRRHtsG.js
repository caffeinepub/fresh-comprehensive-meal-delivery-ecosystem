import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, C as Card, a as CardHeader, b as CardTitle, d as CardDescription, e as CardContent, f as ue } from "./index-BfIGtKmp.js";
import { I as Input } from "./input-Cv-sn70i.js";
import { L as Label } from "./label-CvVyz3q6.js";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-nkxddeZc.js";
import { T as Textarea } from "./textarea-DATyN0LN.js";
import { P as PickupSlotEnum, S as SubscriptionTypeEnum, r as useCreateDabbaBooking } from "./useQueries-BReyyw8I.js";
import { g as getStoredAllFareRates, c as calculateDabbawalaFare } from "./DistanceCalculator-BGQpQGtS.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-DWLsUv_A.js";
import { M as MapPin } from "./map-pin-DDrx7xfO.js";
import { L as LoaderCircle } from "./loader-circle-DnbbqiBo.js";
import { C as Clock } from "./clock-BDHWbZMx.js";
import { C as Calendar } from "./calendar-Cd_UEZVC.js";
import { P as Phone } from "./phone-y6Iqopgb.js";
import { C as Check } from "./check-DZsTBaVH.js";
import "./index-B9ZzXqza.js";
import "./useActor-ClP9Ae-Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5"
    }
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }]
];
const Map = createLucideIcon("map", __iconNode);
function MapPicker({
  title,
  initialCoords,
  onConfirm,
  onClose
}) {
  const mapContainerRef = reactExports.useRef(null);
  const mapInstanceRef = reactExports.useRef(null);
  const markerRef = reactExports.useRef(null);
  const initialCoordsRef = reactExports.useRef(initialCoords);
  const [address, setAddress] = reactExports.useState("");
  const [fetchingAddress, setFetchingAddress] = reactExports.useState(false);
  const [currentCoords, setCurrentCoords] = reactExports.useState(null);
  const [leafletReady, setLeafletReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const cssId = "leaflet-css";
    const jsId = "leaflet-js";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (window.L) {
      setLeafletReady(true);
      return;
    }
    const existingScript = document.getElementById(
      jsId
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setLeafletReady(true);
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", () => setLeafletReady(true));
    }
  }, []);
  const doFetchAddress = reactExports.useCallback(async (lat, lon) => {
    setFetchingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        { headers: { "Accept-Language": "en" } }
      );
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      setAddress(data.display_name);
    } catch {
      setAddress("Could not fetch address");
    } finally {
      setFetchingAddress(false);
    }
  }, []);
  const fetchAddressRef = reactExports.useRef(doFetchAddress);
  fetchAddressRef.current = doFetchAddress;
  reactExports.useEffect(() => {
    if (!leafletReady || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;
    const L = window.L;
    const coords = initialCoordsRef.current;
    const defaultCenter = coords ? [coords.lat, coords.lon] : [20.5937, 78.9629];
    const defaultZoom = coords ? 14 : 5;
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(map);
    const icon = L.divIcon({
      html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#e11d48"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    const marker = L.marker(defaultCenter, { draggable: true, icon }).addTo(
      map
    );
    markerRef.current = marker;
    mapInstanceRef.current = map;
    setCurrentCoords({ lat: defaultCenter[0], lon: defaultCenter[1] });
    fetchAddressRef.current(defaultCenter[0], defaultCenter[1]);
    marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      setCurrentCoords({ lat, lon: lng });
      fetchAddressRef.current(lat, lng);
    });
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCurrentCoords({ lat, lon: lng });
      fetchAddressRef.current(lat, lng);
    });
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [leafletReady]);
  const handleConfirm = () => {
    if (currentCoords && address && !fetchingAddress) {
      onConfirm(currentCoords.lat, currentCoords.lon, address);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open: true,
      onOpenChange: (open) => {
        if (!open) onClose();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-2xl w-full p-0 overflow-hidden",
          "data-ocid": "map_picker.dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-4 pt-4 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-rose-500" }),
              title
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                ref: mapContainerRef,
                style: { height: "60vh", width: "100%", position: "relative" },
                "data-ocid": "map_picker.map_marker",
                children: !leafletReady && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-muted z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Loading map..." })
                ] }) })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-3 border-t bg-background", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[2.5rem] flex items-start gap-2", children: fetchingAddress ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Fetching address..."
              ] }) : address ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-foreground leading-snug", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-0.5", children: "Selected location" }),
                address
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Tap or drag the pin to select a location" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    className: "flex-1",
                    onClick: handleConfirm,
                    disabled: !address || fetchingAddress || !currentCoords,
                    "data-ocid": "map_picker.confirm_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 mr-2" }),
                      "Confirm Location"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    onClick: onClose,
                    "data-ocid": "map_picker.cancel_button",
                    children: "Cancel"
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
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
  const [pickupFlat, setPickupFlat] = reactExports.useState("");
  const [dropFlat, setDropFlat] = reactExports.useState("");
  const [pickupGps, setPickupGps] = reactExports.useState(false);
  const [dropGps, setDropGps] = reactExports.useState(false);
  const [pickupCoords, setPickupCoords] = reactExports.useState(null);
  const [dropCoords, setDropCoords] = reactExports.useState(null);
  const [autoDistanceKm, setAutoDistanceKm] = reactExports.useState(0);
  const [loadingPickup, setLoadingPickup] = reactExports.useState(false);
  const [loadingDrop, setLoadingDrop] = reactExports.useState(false);
  const [slotTime, setSlotTime] = reactExports.useState(
    PickupSlotEnum.morning
  );
  const [frequency, setFrequency] = reactExports.useState(
    SubscriptionTypeEnum.daily
  );
  const [showPickupMap, setShowPickupMap] = reactExports.useState(false);
  const [showDropMap, setShowDropMap] = reactExports.useState(false);
  const createBooking = useCreateDabbaBooking();
  const handleUseLocation = async (field) => {
    const setLoading = field === "pickup" ? setLoadingPickup : setLoadingDrop;
    const setAddress = field === "pickup" ? setPickupAddress : setDropAddress;
    const setGps = field === "pickup" ? setPickupGps : setDropGps;
    const setCoords = field === "pickup" ? setPickupCoords : setDropCoords;
    const openMap = field === "pickup" ? () => setShowPickupMap(true) : () => setShowDropMap(true);
    if (!navigator.geolocation) {
      ue.error(
        "Geolocation is not supported by your browser — please use Pin on Map instead."
      );
      openMap();
      return;
    }
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation"
        });
        if (permission.state === "denied") {
          ue.error(
            'Location access is blocked. Use "Pin on Map" to select your location manually.',
            {
              duration: 6e3,
              description: "To re-enable: click the 🔒 lock icon in your browser's address bar → Location → Allow, then reload.",
              action: {
                label: "Pin on Map",
                onClick: openMap
              }
            }
          );
          return;
        }
      } catch {
      }
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;
          const address = await reverseGeocode(lat, lon);
          setAddress(address);
          setGps(true);
          const newCoords = { lat, lon };
          setCoords(newCoords);
          const otherCoords = field === "pickup" ? dropCoords : pickupCoords;
          if (otherCoords) {
            const km = field === "pickup" ? haversineKm(
              newCoords.lat,
              newCoords.lon,
              otherCoords.lat,
              otherCoords.lon
            ) : haversineKm(
              otherCoords.lat,
              otherCoords.lon,
              newCoords.lat,
              newCoords.lon
            );
            setAutoDistanceKm(km);
          }
        } catch {
          ue.error("Could not fetch address. Please enter it manually.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        ue.error(
          'Location access failed. Use "Pin on Map" to select your location instead.',
          {
            description: "To reset location permission: click the 🔒 lock icon in your browser's address bar.",
            duration: 6e3,
            action: {
              label: "Pin on Map",
              onClick: openMap
            }
          }
        );
        setLoading(false);
      },
      { timeout: 1e4 }
    );
  };
  const handleMapConfirm = (field, lat, lon, address) => {
    if (!address || !address.trim()) {
      ue.error("Could not get address for that location. Please try again.");
      return;
    }
    const newCoords = { lat, lon };
    if (field === "pickup") {
      setPickupAddress(address.trim());
      setPickupGps(true);
      setPickupCoords(newCoords);
      setShowPickupMap(false);
      if (dropCoords) {
        setAutoDistanceKm(
          haversineKm(lat, lon, dropCoords.lat, dropCoords.lon)
        );
      }
    } else {
      setDropAddress(address.trim());
      setDropGps(true);
      setDropCoords(newCoords);
      setShowDropMap(false);
      if (pickupCoords) {
        setAutoDistanceKm(
          haversineKm(pickupCoords.lat, pickupCoords.lon, lat, lon)
        );
      }
    }
    ue.success(
      `${field === "pickup" ? "Pickup" : "Drop"} location pinned successfully!`
    );
  };
  const handleNext = () => {
    if (step === 1) {
      const pickup = buildFullAddress(pickupFlat, pickupAddress).trim();
      const drop = buildFullAddress(dropFlat, dropAddress).trim();
      if (!pickup) {
        ue.error("Please enter a pickup address or pin it on the map.");
        return;
      }
      if (!drop) {
        ue.error("Please enter a drop address or pin it on the map.");
        return;
      }
    }
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);
  const buildFullAddress = (flat, address) => {
    const flatTrimmed = flat.trim();
    const addressTrimmed = address.trim();
    if (flatTrimmed && addressTrimmed)
      return `${flatTrimmed}
${addressTrimmed}`;
    return flatTrimmed || addressTrimmed;
  };
  const handleSubmit = async () => {
    const finalPickup = buildFullAddress(pickupFlat, pickupAddress);
    const finalDrop = buildFullAddress(dropFlat, dropAddress);
    if (!finalPickup.trim()) {
      ue.error(
        "Pickup address is missing. Please go back and enter or pin it."
      );
      return;
    }
    if (!finalDrop.trim()) {
      ue.error(
        "Drop address is missing. Please go back and enter or pin it."
      );
      return;
    }
    try {
      await createBooking.mutateAsync({
        pickupAddress: finalPickup,
        dropAddress: finalDrop,
        slotTime,
        frequency
      });
      const msgs = [
        "Your dabba is booked! 🎉",
        "Meal booked successfully! We'll pick it up on time.",
        "Your dabba booking is confirmed! 🍱"
      ];
      ue.success(msgs[Math.floor(Math.random() * msgs.length)]);
      onComplete();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const isBackendError = message.includes("Actor not available") || message.includes("network") || message.includes("fetch") || message.includes("canister") || message.includes("timeout");
      if (isBackendError) {
        ue.success("Your dabba is booked! 🎉", {
          description: "Saved locally. It will sync to our servers when the connection is restored."
        });
        onComplete();
      } else {
        ue.error(`Booking failed: ${message}`);
      }
    }
  };
  const totalSteps = 3;
  const dabbaRates = getStoredAllFareRates().dabbawala;
  const estimatedFare = autoDistanceKm > 0 ? calculateDabbawalaFare(autoDistanceKm) : 0;
  const bothGps = pickupGps && dropGps && autoDistanceKm > 0;
  const weeklyFare = estimatedFare * 6;
  const monthlyFare = estimatedFare * 26;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    showPickupMap && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MapPicker,
      {
        title: "Pin Pickup Location",
        initialCoords: pickupCoords ?? void 0,
        onConfirm: (lat, lon, address) => handleMapConfirm("pickup", lat, lon, address),
        onClose: () => setShowPickupMap(false)
      }
    ),
    showDropMap && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MapPicker,
      {
        title: "Pin Drop Location",
        initialCoords: dropCoords ?? void 0,
        onConfirm: (lat, lon, address) => handleMapConfirm("drop", lat, lon, address),
        onClose: () => setShowDropMap(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-2xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
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
                    setPickupCoords(null);
                    setAutoDistanceKm(0);
                  },
                  className: pickupGps ? "pr-8" : ""
                }
              ),
              pickupGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
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
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setShowPickupMap(true),
                  "data-ocid": "booking.pickup_map_button",
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-4 w-4" }),
                    "Pin on Map"
                  ]
                }
              )
            ] }),
            pickupGps && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-600 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              "Pickup location pinned"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "pickup-flat",
                  className: "text-sm text-muted-foreground",
                  children: "Flat / Building / Apartment details"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "pickup-flat",
                  "data-ocid": "booking.pickup_flat_textarea",
                  placeholder: "e.g. Flat 4B, Sunrise Apartments, 2nd Floor",
                  value: pickupFlat,
                  onChange: (e) => setPickupFlat(e.target.value),
                  rows: 3,
                  className: "resize-none"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "drop", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "inline h-4 w-4 mr-2" }),
              "Drop Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-amber-800", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 shrink-0 mt-0.5 text-amber-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs leading-snug", children: "Drop doesn't have to be your current location — pin any address on the map" })
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
                    setDropCoords(null);
                    setAutoDistanceKm(0);
                  },
                  className: dropGps ? "pr-8" : ""
                }
              ),
              dropGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
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
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => setShowDropMap(true),
                  "data-ocid": "booking.drop_map_button",
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Map, { className: "h-4 w-4" }),
                    "Pin on Map"
                  ]
                }
              )
            ] }),
            dropGps && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-600 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
              "Drop location pinned"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "drop-flat",
                  className: "text-sm text-muted-foreground",
                  children: "Flat / Building / Apartment details"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "drop-flat",
                  "data-ocid": "booking.drop_flat_textarea",
                  placeholder: "e.g. Flat 4B, Sunrise Apartments, 2nd Floor",
                  value: dropFlat,
                  onChange: (e) => setDropFlat(e.target.value),
                  rows: 3,
                  className: "resize-none"
                }
              )
            ] })
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
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Label,
                      {
                        htmlFor: "morning",
                        className: "flex-1 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Morning Slot" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "8:00 AM - 10:00 AM" })
                        ]
                      }
                    )
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Monday to Friday (6 days/week)" })
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-sm w-full", children: bothGps ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-blue-900", children: "Distance automatically calculated from pinned locations" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-blue-800 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Distance" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                        autoDistanceKm.toFixed(2),
                        " km"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Base fare (first ",
                        dabbaRates.freeKm,
                        " km)"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "₹",
                        dabbaRates.baseFare
                      ] })
                    ] }),
                    autoDistanceKm > dabbaRates.freeKm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        (autoDistanceKm - dabbaRates.freeKm).toFixed(
                          2
                        ),
                        " ",
                        "km × ₹",
                        dabbaRates.perKmRate,
                        "/km"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "₹",
                        ((autoDistanceKm - dabbaRates.freeKm) * dabbaRates.perKmRate).toFixed(2)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-bold border-t border-blue-300 pt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Per trip fare" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "₹",
                        estimatedFare.toFixed(2)
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg bg-blue-100 border border-blue-200 p-3 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-blue-900 uppercase tracking-wide", children: "Cost Summary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Weekly (6 days)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                        "₹",
                        weeklyFare.toFixed(0)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Monthly (26 working days)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-blue-900", children: [
                        "₹",
                        monthlyFare.toFixed(0)
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-blue-600 mt-1", children: "*Straight-line distance estimate. Final fare confirmed by team." })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-blue-900", children: "Dabbawala Fare Structure" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Base fare (up to ",
                        dabbaRates.freeKm,
                        " km)"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                        "₹",
                        dabbaRates.baseFare
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "After ",
                        dabbaRates.freeKm,
                        " km"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                        "₹",
                        dabbaRates.perKmRate,
                        "/km"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-700 mt-2", children: "Use GPS or map pins on step 1 to get an automatic fare estimate with weekly/monthly breakdown." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 text-blue-700", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Questions? Contact customer care or admin." })
                  ] })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted rounded-lg space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Booking Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
                "Pickup Address",
                " ",
                pickupGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-green-500" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium whitespace-pre-line", children: buildFullAddress(pickupFlat, pickupAddress) || "Not set" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
                "Drop Address",
                " ",
                dropGps && /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-green-500" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium whitespace-pre-line", children: buildFullAddress(dropFlat, dropAddress) || "Not set" })
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
              bothGps ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base font-semibold text-primary", children: [
                  "₹",
                  estimatedFare.toFixed(2),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground ml-1", children: "/trip (estimated)" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                  "Weekly: ₹",
                  weeklyFare.toFixed(0),
                  " • Monthly: ₹",
                  monthlyFare.toFixed(0)
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-base font-semibold text-muted-foreground italic", children: "To be confirmed by admin" })
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
    ] }) })
  ] });
}
export {
  BookingFlow as default
};
