import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, MapPin, Navigation } from "lucide-react";
import { useState } from "react";

export interface FareRates {
  baseFare: number;
  perKmRate: number;
  minFare: number;
  freeKm: number; // km included in base fare
}

export interface AllFareRates {
  restaurant: FareRates;
  dabbawala: FareRates;
}

const DEFAULT_RESTAURANT_RATES: FareRates = {
  baseFare: 45,
  perKmRate: 6,
  minFare: 45,
  freeKm: 3,
};

const DEFAULT_DABBAWALA_RATES: FareRates = {
  baseFare: 35,
  perKmRate: 6,
  minFare: 35,
  freeKm: 4,
};

const STORAGE_KEY = "allFareRates";

export function getStoredAllFareRates(): AllFareRates {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    restaurant: DEFAULT_RESTAURANT_RATES,
    dabbawala: DEFAULT_DABBAWALA_RATES,
  };
}

export function saveAllFareRates(rates: AllFareRates): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rates));
}

/** Legacy shim — kept so other files that import getStoredFareRates() still compile */
export function getStoredFareRates(): FareRates {
  return getStoredAllFareRates().restaurant;
}

export function saveFareRates(rates: FareRates): void {
  const all = getStoredAllFareRates();
  saveAllFareRates({ ...all, restaurant: rates });
}

export function calculateFareForType(
  distanceKm: number,
  type: "restaurant" | "dabbawala",
  overrideRates?: FareRates,
): number {
  const rates =
    overrideRates ??
    (type === "restaurant"
      ? getStoredAllFareRates().restaurant
      : getStoredAllFareRates().dabbawala);

  const extraKm = Math.max(0, distanceKm - rates.freeKm);
  const fare = rates.baseFare + extraKm * rates.perKmRate;
  return Math.max(fare, rates.minFare);
}

export function calculateDabbawalaFare(
  distanceKm: number,
  rates?: FareRates,
): number {
  return calculateFareForType(distanceKm, "dabbawala", rates);
}

export function calculateRestaurantFare(
  distanceKm: number,
  rates?: FareRates,
): number {
  return calculateFareForType(distanceKm, "restaurant", rates);
}

/** Legacy export kept for compatibility */
export function calculateFare(distanceKm: number, rates?: FareRates): number {
  return calculateRestaurantFare(distanceKm, rates);
}

interface DistanceCalculatorProps {
  pickupAddress: string;
  dropAddress: string;
  orderType?: "restaurant" | "dabbawala";
  onDistanceSet?: (distanceKm: number, fare: number) => void;
}

export default function DistanceCalculator({
  pickupAddress,
  dropAddress,
  orderType = "restaurant",
  onDistanceSet,
}: DistanceCalculatorProps) {
  const [distanceKm, setDistanceKm] = useState("");
  const rates =
    orderType === "dabbawala"
      ? getStoredAllFareRates().dabbawala
      : getStoredAllFareRates().restaurant;
  const distanceNum = Number.parseFloat(distanceKm) || 0;
  const fare =
    distanceNum > 0 ? calculateFareForType(distanceNum, orderType) : 0;
  const extraKm = Math.max(0, distanceNum - rates.freeKm);

  const handleApply = () => {
    if (distanceNum > 0 && onDistanceSet) {
      onDistanceSet(distanceNum, fare);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Distance & Fare Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 text-sm">
          <div className="flex-1 p-2 bg-muted rounded text-muted-foreground truncate">
            <MapPin className="inline h-3 w-3 mr-1" />
            {pickupAddress || "Pickup not set"}
          </div>
          <div className="flex-1 p-2 bg-muted rounded text-muted-foreground truncate">
            <Navigation className="inline h-3 w-3 mr-1" />
            {dropAddress || "Drop not set"}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="distance-input" className="text-sm">
            Enter Distance (km)
          </Label>
          <div className="flex gap-2">
            <Input
              id="distance-input"
              data-ocid="distance.input"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 5.5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value)}
              className="flex-1"
            />
            <span className="flex items-center text-sm text-muted-foreground px-2">
              km
            </span>
          </div>
        </div>

        {distanceNum > 0 && (
          <div className="rounded-lg bg-primary/10 p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Base fare (incl. first {rates.freeKm} km)
              </span>
              <span>₹{rates.baseFare}</span>
            </div>
            {extraKm > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {extraKm.toFixed(2)} km × ₹{rates.perKmRate}/km
                </span>
                <span>₹{(extraKm * rates.perKmRate).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
              <span>Estimated Fare</span>
              <span className="text-primary">₹{fare.toFixed(2)}</span>
            </div>
          </div>
        )}

        {onDistanceSet && distanceNum > 0 && (
          <Button
            data-ocid="distance.primary_button"
            size="sm"
            className="w-full"
            onClick={handleApply}
          >
            Apply to Booking
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
