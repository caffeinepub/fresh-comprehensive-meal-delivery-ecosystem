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
}

export function getStoredFareRates(): FareRates {
  try {
    const stored = localStorage.getItem("fareRates");
    if (stored) return JSON.parse(stored);
  } catch {}
  return { baseFare: 30, perKmRate: 12, minFare: 50 };
}

export function saveFareRates(rates: FareRates): void {
  localStorage.setItem("fareRates", JSON.stringify(rates));
}

export function calculateFare(distanceKm: number, rates?: FareRates): number {
  const r = rates || getStoredFareRates();
  const fare = r.baseFare + distanceKm * r.perKmRate;
  return Math.max(fare, r.minFare);
}

interface DistanceCalculatorProps {
  pickupAddress: string;
  dropAddress: string;
  onDistanceSet?: (distanceKm: number, fare: number) => void;
}

export default function DistanceCalculator({
  pickupAddress,
  dropAddress,
  onDistanceSet,
}: DistanceCalculatorProps) {
  const [distanceKm, setDistanceKm] = useState("");
  const rates = getStoredFareRates();
  const distanceNum = Number.parseFloat(distanceKm) || 0;
  const fare = distanceNum > 0 ? calculateFare(distanceNum, rates) : 0;

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
              <span className="text-muted-foreground">Base fare</span>
              <span>₹{rates.baseFare}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {distanceNum} km × ₹{rates.perKmRate}/km
              </span>
              <span>₹{(distanceNum * rates.perKmRate).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-1 mt-1">
              <span>Estimated Fare</span>
              <span className="text-primary">₹{fare.toFixed(2)}</span>
            </div>
            {fare === rates.minFare && (
              <p className="text-xs text-muted-foreground">
                *Minimum fare applied
              </p>
            )}
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
