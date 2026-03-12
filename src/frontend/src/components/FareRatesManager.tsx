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
import { IndianRupee, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type FareRates,
  getStoredFareRates,
  saveFareRates,
} from "./DistanceCalculator";

export default function FareRatesManager() {
  const [rates, setRates] = useState<FareRates>(getStoredFareRates());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRates(getStoredFareRates());
  }, []);

  const handleSave = () => {
    if (rates.baseFare < 0 || rates.perKmRate <= 0 || rates.minFare < 0) {
      toast.error("All rates must be positive values");
      return;
    }
    setSaving(true);
    saveFareRates(rates);
    setTimeout(() => {
      setSaving(false);
      toast.success("Fare rates updated successfully");
    }, 400);
  };

  const exampleFare = Math.max(
    rates.minFare,
    rates.baseFare + 5 * rates.perKmRate,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Fare Rate Management
        </CardTitle>
        <CardDescription>
          Set the pricing rules for pickup/drop distance-based fare calculation.
          Changes apply immediately to all new bookings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="base-fare">Base Fare (₹)</Label>
            <Input
              id="base-fare"
              data-ocid="fare.input"
              type="number"
              min="0"
              step="1"
              value={rates.baseFare}
              onChange={(e) =>
                setRates((r) => ({
                  ...r,
                  baseFare: Number.parseFloat(e.target.value) || 0,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Fixed charge per booking
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="per-km-rate">Per Km Rate (₹/km)</Label>
            <Input
              id="per-km-rate"
              data-ocid="fare.secondary_button"
              type="number"
              min="0"
              step="0.5"
              value={rates.perKmRate}
              onChange={(e) =>
                setRates((r) => ({
                  ...r,
                  perKmRate: Number.parseFloat(e.target.value) || 0,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Charge per kilometre
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-fare">Minimum Fare (₹)</Label>
            <Input
              id="min-fare"
              data-ocid="fare.cancel_button"
              type="number"
              min="0"
              step="1"
              value={rates.minFare}
              onChange={(e) =>
                setRates((r) => ({
                  ...r,
                  minFare: Number.parseFloat(e.target.value) || 0,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Floor price regardless of distance
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="text-sm font-medium">Fare Preview (for 5 km trip)</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base fare</span>
            <span>₹{rates.baseFare}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              5 km × ₹{rates.perKmRate}/km
            </span>
            <span>₹{(5 * rates.perKmRate).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Estimated Total</span>
            <span>₹{exampleFare.toFixed(2)}</span>
          </div>
        </div>

        <Button
          data-ocid="fare.save_button"
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Fare Rates"}
        </Button>
      </CardContent>
    </Card>
  );
}
