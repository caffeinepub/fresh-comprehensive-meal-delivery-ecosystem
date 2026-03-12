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
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Info,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateDabbaBooking } from "../hooks/useQueries";
import { PickupSlotEnum, SubscriptionTypeEnum } from "../types/local";

interface BookingFlowProps {
  onComplete: () => void;
  onCancel: () => void;
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
  const [pickupGps, setPickupGps] = useState(false);
  const [dropGps, setDropGps] = useState(false);
  const [loadingPickup, setLoadingPickup] = useState(false);
  const [loadingDrop, setLoadingDrop] = useState(false);
  const [slotTime, setSlotTime] = useState<PickupSlotEnum>(
    PickupSlotEnum.morning,
  );
  const [frequency, setFrequency] = useState<SubscriptionTypeEnum>(
    SubscriptionTypeEnum.daily,
  );

  const createBooking = useCreateDabbaBooking();

  const handleUseLocation = (field: "pickup" | "drop") => {
    const setLoading = field === "pickup" ? setLoadingPickup : setLoadingDrop;
    const setAddress = field === "pickup" ? setPickupAddress : setDropAddress;
    const setGps = field === "pickup" ? setPickupGps : setDropGps;

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const address = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          setAddress(address);
          setGps(true);
        } catch {
          toast.error("Could not fetch address. Please enter it manually.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error(
          "Location permission denied. Please enter address manually.",
        );
        setLoading(false);
      },
      { timeout: 10000 },
    );
  };

  const handleNext = () => {
    if (step === 1 && (!pickupAddress || !dropAddress)) {
      toast.error("Please fill in both addresses");
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
        frequency,
      });
      toast.success("Booking created successfully!");
      onComplete();
    } catch (_error) {
      toast.error("Failed to create booking");
    }
  };

  const totalSteps = 3;

  return (
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
                    }}
                    className={pickupGps ? "pr-8" : ""}
                  />
                  {pickupGps && (
                    <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" />
                  )}
                </div>
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
                  {loadingPickup ? "Fetching location..." : "Use my location"}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drop">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Drop Address
                </Label>
                <div className="relative">
                  <Input
                    id="drop"
                    data-ocid="booking.textarea"
                    placeholder="Enter your drop/delivery address"
                    value={dropAddress}
                    onChange={(e) => {
                      setDropAddress(e.target.value);
                      setDropGps(false);
                    }}
                    className={dropGps ? "pr-8" : ""}
                  />
                  {dropGps && (
                    <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" />
                  )}
                </div>
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
                    <Label htmlFor="morning" className="flex-1 cursor-pointer">
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
                        Monday to Friday
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
              {/* Fare info notice — customers cannot enter distance */}
              <div
                className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800"
                data-ocid="booking.panel"
              >
                <Info className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-blue-900">
                    Fare will be calculated by our team
                  </p>
                  <p className="text-blue-700">
                    The distance and fare for your booking will be verified and
                    set by our admin team after you submit. You will be notified
                    of the final fare before delivery begins.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-blue-700">
                    <Phone className="h-4 w-4" />
                    <span>
                      Questions? Contact customer care or reach out to our
                      admin.
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking summary */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Booking Summary
                </p>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    Pickup Address
                    {pickupGps && (
                      <MapPin className="h-3.5 w-3.5 text-green-500" />
                    )}
                  </div>
                  <div className="font-medium">{pickupAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    Drop Address
                    {dropGps && (
                      <MapPin className="h-3.5 w-3.5 text-green-500" />
                    )}
                  </div>
                  <div className="font-medium">{dropAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Slot</div>
                  <div className="font-medium">
                    {slotTime === PickupSlotEnum.morning
                      ? "8:00 AM - 10:00 AM"
                      : "10:00 AM - 12:00 PM"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Frequency</div>
                  <div className="font-medium capitalize">{frequency}</div>
                </div>
                <div className="border-t pt-3">
                  <div className="text-sm text-muted-foreground">Fare</div>
                  <div className="text-base font-semibold text-muted-foreground italic">
                    To be confirmed by admin
                  </div>
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
                {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
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
  );
}
