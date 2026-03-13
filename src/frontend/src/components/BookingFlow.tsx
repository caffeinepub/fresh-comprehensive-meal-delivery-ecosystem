import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Info,
  Loader2,
  Map as MapIcon,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateDabbaBooking } from "../hooks/useQueries";
import { PickupSlotEnum, SubscriptionTypeEnum } from "../types/local";
import {
  calculateDabbawalaFare,
  getStoredAllFareRates,
} from "./DistanceCalculator";
import MapPicker from "./MapPicker";

interface BookingFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Coords {
  lat: number;
  lon: number;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    { headers: { "Accept-Language": "en" } },
  );
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  return data.display_name as string;
}

export default function BookingFlow({
  onComplete,
  onCancel,
}: BookingFlowProps) {
  const [step, setStep] = useState(1);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");
  const [pickupFlat, setPickupFlat] = useState("");
  const [dropFlat, setDropFlat] = useState("");
  const [pickupGps, setPickupGps] = useState(false);
  const [dropGps, setDropGps] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<Coords | null>(null);
  const [dropCoords, setDropCoords] = useState<Coords | null>(null);
  const [autoDistanceKm, setAutoDistanceKm] = useState(0);
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDrop, setLoadingDrop] = useState(false);
  const [slotTime, setSlotTime] = useState<PickupSlotEnum>(
    PickupSlotEnum.morning,
  );
  const [frequency, setFrequency] = useState<SubscriptionTypeEnum>(
    SubscriptionTypeEnum.daily,
  );
  const [showPickupMap, setShowPickupMap] = useState(false);
  const [showDropMap, setShowDropMap] = useState(false);

  const createBooking = useCreateDabbaBooking();

  const handleUseLocation = async (field: "pickup" | "drop") => {
    const setLoading = field === "pickup" ? setLoadingPickup : setLoadingDrop;
    const setAddress = field === "pickup" ? setPickupAddress : setDropAddress;
    const setGps = field === "pickup" ? setPickupGps : setDropGps;
    const setCoords = field === "pickup" ? setPickupCoords : setDropCoords;
    const openMap =
      field === "pickup"
        ? () => setShowPickupMap(true)
        : () => setShowDropMap(true);

    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by your browser — please use Pin on Map instead.",
      );
      openMap();
      return;
    }

    // Check permission state before requesting
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });

        if (permission.state === "denied") {
          toast.error(
            'Location access is blocked. Use "Pin on Map" to select your location manually.',
            {
              duration: 6000,
              description:
                "To re-enable: click the 🔒 lock icon in your browser's address bar → Location → Allow, then reload.",
              action: {
                label: "Pin on Map",
                onClick: openMap,
              },
            },
          );
          return;
        }
      } catch {
        // Permissions API not supported — fall through to getCurrentPosition
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
          const newCoords: Coords = { lat, lon };
          setCoords(newCoords);
          const otherCoords = field === "pickup" ? dropCoords : pickupCoords;
          if (otherCoords) {
            const km =
              field === "pickup"
                ? haversineKm(
                    newCoords.lat,
                    newCoords.lon,
                    otherCoords.lat,
                    otherCoords.lon,
                  )
                : haversineKm(
                    otherCoords.lat,
                    otherCoords.lon,
                    newCoords.lat,
                    newCoords.lon,
                  );
            setAutoDistanceKm(km);
          }
        } catch {
          toast.error("Could not fetch address. Please enter it manually.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error(
          'Location access failed. Use "Pin on Map" to select your location instead.',
          {
            description:
              "To reset location permission: click the 🔒 lock icon in your browser's address bar.",
            duration: 6000,
            action: {
              label: "Pin on Map",
              onClick: openMap,
            },
          },
        );
        setLoading(false);
      },
      { timeout: 10000 },
    );
  };

  const handleMapConfirm = (
    field: "pickup" | "drop",
    lat: number,
    lon: number,
    address: string,
  ) => {
    if (!address || !address.trim()) {
      toast.error("Could not get address for that location. Please try again.");
      return;
    }

    const newCoords: Coords = { lat, lon };
    if (field === "pickup") {
      setPickupAddress(address.trim());
      setPickupGps(true);
      setPickupCoords(newCoords);
      setShowPickupMap(false);
      if (dropCoords) {
        setAutoDistanceKm(
          haversineKm(lat, lon, dropCoords.lat, dropCoords.lon),
        );
      }
    } else {
      setDropAddress(address.trim());
      setDropGps(true);
      setDropCoords(newCoords);
      setShowDropMap(false);
      if (pickupCoords) {
        setAutoDistanceKm(
          haversineKm(pickupCoords.lat, pickupCoords.lon, lat, lon),
        );
      }
    }

    toast.success(
      `${field === "pickup" ? "Pickup" : "Drop"} location pinned successfully!`,
    );
  };

  const handleNext = () => {
    if (step === 1) {
      const pickup = buildFullAddress(pickupFlat, pickupAddress).trim();
      const drop = buildFullAddress(dropFlat, dropAddress).trim();

      if (!pickup) {
        toast.error("Please enter a pickup address or pin it on the map.");
        return;
      }
      if (!drop) {
        toast.error("Please enter a drop address or pin it on the map.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const buildFullAddress = (flat: string, address: string) => {
    const flatTrimmed = flat.trim();
    const addressTrimmed = address.trim();
    if (flatTrimmed && addressTrimmed)
      return `${flatTrimmed}\n${addressTrimmed}`;
    return flatTrimmed || addressTrimmed;
  };

  const handleSubmit = async () => {
    const finalPickup = buildFullAddress(pickupFlat, pickupAddress);
    const finalDrop = buildFullAddress(dropFlat, dropAddress);

    // Guard: ensure addresses are non-empty before submitting
    if (!finalPickup.trim()) {
      toast.error(
        "Pickup address is missing. Please go back and enter or pin it.",
      );
      return;
    }
    if (!finalDrop.trim()) {
      toast.error(
        "Drop address is missing. Please go back and enter or pin it.",
      );
      return;
    }

    try {
      await createBooking.mutateAsync({
        pickupAddress: finalPickup,
        dropAddress: finalDrop,
        slotTime,
        frequency,
      });
      const msgs = [
        "Your dabba is booked! 🎉",
        "Meal booked successfully! We'll pick it up on time.",
        "Your dabba booking is confirmed! 🍱",
      ];
      toast.success(msgs[Math.floor(Math.random() * msgs.length)]);
      onComplete();
    } catch (err: unknown) {
      // Booking is already saved locally even if backend sync fails.
      // If the error is a backend/network error, treat as soft failure.
      const message = err instanceof Error ? err.message : String(err);

      const isBackendError =
        message.includes("Actor not available") ||
        message.includes("network") ||
        message.includes("fetch") ||
        message.includes("canister") ||
        message.includes("timeout");

      if (isBackendError) {
        // Booking saved locally — show success and warn about sync
        toast.success("Your dabba is booked! 🎉", {
          description:
            "Saved locally. It will sync to our servers when the connection is restored.",
        });
        onComplete();
      } else {
        toast.error(`Booking failed: ${message}`);
      }
    }
  };

  const totalSteps = 3;
  const dabbaRates = getStoredAllFareRates().dabbawala;
  const estimatedFare =
    autoDistanceKm > 0 ? calculateDabbawalaFare(autoDistanceKm) : 0;
  const bothGps = pickupGps && dropGps && autoDistanceKm > 0;

  // Weekly/monthly cost estimates (6 working days/week, 26 working days/month)
  const weeklyFare = estimatedFare * 6;
  const monthlyFare = estimatedFare * 26;

  return (
    <>
      {showPickupMap && (
        <MapPicker
          title="Pin Pickup Location"
          initialCoords={pickupCoords ?? undefined}
          onConfirm={(lat, lon, address) =>
            handleMapConfirm("pickup", lat, lon, address)
          }
          onClose={() => setShowPickupMap(false)}
        />
      )}
      {showDropMap && (
        <MapPicker
          title="Pin Drop Location"
          initialCoords={dropCoords ?? undefined}
          onConfirm={(lat, lon, address) =>
            handleMapConfirm("drop", lat, lon, address)
          }
          onClose={() => setShowDropMap(false)}
        />
      )}

      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Book Dabba Pickup</CardTitle>
            <CardDescription>
              Step {step} of {totalSteps}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                {/* Pickup */}
                <div className="space-y-2">
                  <Label htmlFor="pickup">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Pickup Address (Home / Hotel)
                  </Label>
                  <div className="relative">
                    <Input
                      id="pickup"
                      data-ocid="booking.input"
                      placeholder="Enter your home or hotel address"
                      value={pickupAddress}
                      onChange={(e) => {
                        setPickupAddress(e.target.value);
                        setPickupGps(false);
                        setPickupCoords(null);
                        setAutoDistanceKm(0);
                      }}
                      className={pickupGps ? "pr-8" : ""}
                    />
                    {pickupGps && (
                      <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" />
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={loadingPickup}
                      onClick={() => handleUseLocation("pickup")}
                      data-ocid="booking.pickup_location_button"
                      className="flex items-center gap-2"
                    >
                      {loadingPickup ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {loadingPickup
                        ? "Fetching location..."
                        : "Use my location"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPickupMap(true)}
                      data-ocid="booking.pickup_map_button"
                      className="flex items-center gap-2"
                    >
                      <MapIcon className="h-4 w-4" />
                      Pin on Map
                    </Button>
                  </div>
                  {pickupGps && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Pickup location pinned
                    </p>
                  )}
                  <div className="space-y-1">
                    <Label
                      htmlFor="pickup-flat"
                      className="text-sm text-muted-foreground"
                    >
                      Flat / Building / Apartment details
                    </Label>
                    <Textarea
                      id="pickup-flat"
                      data-ocid="booking.pickup_flat_textarea"
                      placeholder="e.g. Flat 4B, Sunrise Apartments, 2nd Floor"
                      value={pickupFlat}
                      onChange={(e) => setPickupFlat(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                {/* Drop */}
                <div className="space-y-2">
                  <Label htmlFor="drop">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Drop Address
                  </Label>
                  <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-amber-800">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                    <p className="text-xs leading-snug">
                      Drop doesn't have to be your current location — pin any
                      address on the map
                    </p>
                  </div>
                  <div className="relative">
                    <Input
                      id="drop"
                      data-ocid="booking.textarea"
                      placeholder="Enter your drop/delivery address"
                      value={dropAddress}
                      onChange={(e) => {
                        setDropAddress(e.target.value);
                        setDropGps(false);
                        setDropCoords(null);
                        setAutoDistanceKm(0);
                      }}
                      className={dropGps ? "pr-8" : ""}
                    />
                    {dropGps && (
                      <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" />
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={loadingDrop}
                      onClick={() => handleUseLocation("drop")}
                      data-ocid="booking.drop_location_button"
                      className="flex items-center gap-2"
                    >
                      {loadingDrop ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {loadingDrop ? "Fetching location..." : "Use my location"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDropMap(true)}
                      data-ocid="booking.drop_map_button"
                      className="flex items-center gap-2"
                    >
                      <MapIcon className="h-4 w-4" />
                      Pin on Map
                    </Button>
                  </div>
                  {dropGps && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Drop location pinned
                    </p>
                  )}
                  <div className="space-y-1">
                    <Label
                      htmlFor="drop-flat"
                      className="text-sm text-muted-foreground"
                    >
                      Flat / Building / Apartment details
                    </Label>
                    <Textarea
                      id="drop-flat"
                      data-ocid="booking.drop_flat_textarea"
                      placeholder="e.g. Flat 4B, Sunrise Apartments, 2nd Floor"
                      value={dropFlat}
                      onChange={(e) => setDropFlat(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>
                    <Clock className="inline h-4 w-4 mr-2" />
                    Pickup Time Slot
                  </Label>
                  <RadioGroup
                    value={slotTime}
                    onValueChange={(value) =>
                      setSlotTime(value as PickupSlotEnum)
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem
                        value={PickupSlotEnum.morning}
                        id="morning"
                      />
                      <Label
                        htmlFor="morning"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Morning Slot</div>
                        <div className="text-sm text-muted-foreground">
                          8:00 AM - 10:00 AM
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem
                        value={PickupSlotEnum.midMorning}
                        id="midMorning"
                      />
                      <Label
                        htmlFor="midMorning"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Mid-Morning Slot</div>
                        <div className="text-sm text-muted-foreground">
                          10:00 AM - 12:00 PM
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Frequency
                  </Label>
                  <RadioGroup
                    value={frequency}
                    onValueChange={(value) =>
                      setFrequency(value as SubscriptionTypeEnum)
                    }
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem
                        value={SubscriptionTypeEnum.daily}
                        id="daily"
                      />
                      <Label htmlFor="daily" className="flex-1 cursor-pointer">
                        <div className="font-medium">Daily</div>
                        <div className="text-sm text-muted-foreground">
                          Monday to Friday (6 days/week)
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem
                        value={SubscriptionTypeEnum.weekly}
                        id="weekly"
                      />
                      <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                        <div className="font-medium">Weekly</div>
                        <div className="text-sm text-muted-foreground">
                          Select specific days
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {/* Fare info block */}
                <div
                  className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800"
                  data-ocid="booking.panel"
                >
                  <Info className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                  <div className="space-y-2 text-sm w-full">
                    {bothGps ? (
                      <>
                        <p className="font-semibold text-blue-900">
                          Distance automatically calculated from pinned
                          locations
                        </p>
                        {/* Fare breakdown */}
                        <div className="space-y-1 text-blue-800 mt-1">
                          <div className="flex justify-between">
                            <span>Distance</span>
                            <span className="font-semibold">
                              {autoDistanceKm.toFixed(2)} km
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Base fare (first {dabbaRates.freeKm} km)
                            </span>
                            <span>₹{dabbaRates.baseFare}</span>
                          </div>
                          {autoDistanceKm > dabbaRates.freeKm && (
                            <div className="flex justify-between">
                              <span>
                                {(autoDistanceKm - dabbaRates.freeKm).toFixed(
                                  2,
                                )}{" "}
                                km × ₹{dabbaRates.perKmRate}/km
                              </span>
                              <span>
                                ₹
                                {(
                                  (autoDistanceKm - dabbaRates.freeKm) *
                                  dabbaRates.perKmRate
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold border-t border-blue-300 pt-1">
                            <span>Per trip fare</span>
                            <span>₹{estimatedFare.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Weekly / Monthly summary */}
                        <div className="mt-3 rounded-lg bg-blue-100 border border-blue-200 p-3 space-y-1">
                          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                            Cost Summary
                          </p>
                          <div className="flex justify-between text-sm">
                            <span>Weekly (6 days)</span>
                            <span className="font-semibold">
                              ₹{weeklyFare.toFixed(0)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Monthly (26 working days)</span>
                            <span className="font-bold text-blue-900">
                              ₹{monthlyFare.toFixed(0)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          *Straight-line distance estimate. Final fare confirmed
                          by team.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-blue-900">
                          Dabbawala Fare Structure
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>
                              Base fare (up to {dabbaRates.freeKm} km)
                            </span>
                            <span className="font-semibold">
                              ₹{dabbaRates.baseFare}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>After {dabbaRates.freeKm} km</span>
                            <span className="font-semibold">
                              ₹{dabbaRates.perKmRate}/km
                            </span>
                          </div>
                        </div>
                        <p className="text-blue-700 mt-2">
                          Use GPS or map pins on step 1 to get an automatic fare
                          estimate with weekly/monthly breakdown.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-blue-700">
                          <Phone className="h-4 w-4" />
                          <span>
                            Questions? Contact customer care or admin.
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Booking summary */}
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Booking Summary
                  </p>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      Pickup Address{" "}
                      {pickupGps && (
                        <MapPin className="h-3.5 w-3.5 text-green-500" />
                      )}
                    </div>
                    <div className="font-medium whitespace-pre-line">
                      {buildFullAddress(pickupFlat, pickupAddress) || "Not set"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      Drop Address{" "}
                      {dropGps && (
                        <MapPin className="h-3.5 w-3.5 text-green-500" />
                      )}
                    </div>
                    <div className="font-medium whitespace-pre-line">
                      {buildFullAddress(dropFlat, dropAddress) || "Not set"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Time Slot
                    </div>
                    <div className="font-medium">
                      {slotTime === PickupSlotEnum.morning
                        ? "8:00 AM - 10:00 AM"
                        : "10:00 AM - 12:00 PM"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Frequency
                    </div>
                    <div className="font-medium capitalize">{frequency}</div>
                  </div>
                  <div className="border-t pt-3">
                    <div className="text-sm text-muted-foreground">Fare</div>
                    {bothGps ? (
                      <div className="space-y-1">
                        <div className="text-base font-semibold text-primary">
                          ₹{estimatedFare.toFixed(2)}{" "}
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            /trip (estimated)
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Weekly: ₹{weeklyFare.toFixed(0)} &bull; Monthly: ₹
                          {monthlyFare.toFixed(0)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-base font-semibold text-muted-foreground italic">
                        To be confirmed by admin
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  data-ocid="booking.cancel_button"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="flex-1"
                  data-ocid="booking.primary_button"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createBooking.isPending}
                  className="flex-1"
                  data-ocid="booking.submit_button"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {createBooking.isPending
                    ? "Confirming..."
                    : "Confirm Booking"}
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={onCancel}
                data-ocid="booking.close_button"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
