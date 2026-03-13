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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, Package, Save, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type AllFareRates,
  type FareRates,
  getStoredAllFareRates,
  saveAllFareRates,
} from "./DistanceCalculator";

function FareEditor({
  rates,
  onChange,
}: {
  rates: FareRates;
  onChange: (r: FareRates) => void;
}) {
  const extraKm = Math.max(0, 5 - rates.freeKm);
  const previewFare = Math.max(
    rates.minFare,
    rates.baseFare + extraKm * rates.perKmRate,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Base Fare (₹)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={rates.baseFare}
            onChange={(e) =>
              onChange({ ...rates, baseFare: Number(e.target.value) || 0 })
            }
            data-ocid="fare.input"
          />
          <p className="text-xs text-muted-foreground">
            Fixed charge per booking
          </p>
        </div>
        <div className="space-y-2">
          <Label>Free Distance (km)</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={rates.freeKm}
            onChange={(e) =>
              onChange({ ...rates, freeKm: Number(e.target.value) || 0 })
            }
            data-ocid="fare.secondary_button"
          />
          <p className="text-xs text-muted-foreground">
            km included in base fare
          </p>
        </div>
        <div className="space-y-2">
          <Label>Per Km Rate (₹/km)</Label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={rates.perKmRate}
            onChange={(e) =>
              onChange({ ...rates, perKmRate: Number(e.target.value) || 0 })
            }
            data-ocid="fare.cancel_button"
          />
          <p className="text-xs text-muted-foreground">
            Charge per km after free distance
          </p>
        </div>
        <div className="space-y-2">
          <Label>Minimum Fare (₹)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={rates.minFare}
            onChange={(e) =>
              onChange({ ...rates, minFare: Number(e.target.value) || 0 })
            }
          />
          <p className="text-xs text-muted-foreground">Floor price</p>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4 space-y-2">
        <p className="text-sm font-medium">Fare Preview (5 km trip)</p>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Base fare (first {rates.freeKm} km)
          </span>
          <span>₹{rates.baseFare}</span>
        </div>
        {extraKm > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {extraKm} km × ₹{rates.perKmRate}/km
            </span>
            <span>₹{(extraKm * rates.perKmRate).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t pt-2">
          <span>Estimated Total</span>
          <span>₹{previewFare.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function FareRatesManager() {
  const [allRates, setAllRates] = useState<AllFareRates>(
    getStoredAllFareRates(),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAllRates(getStoredAllFareRates());
  }, []);

  const handleSave = () => {
    setSaving(true);
    saveAllFareRates(allRates);
    setTimeout(() => {
      setSaving(false);
      toast.success("Fare rates updated successfully");
    }, 400);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IndianRupee className="h-5 w-5" />
          Fare Rate Management
        </CardTitle>
        <CardDescription>
          Set pricing rules for each order type. Changes apply immediately to
          all new bookings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="dabbawala">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dabbawala" data-ocid="fare.dabbawala.tab">
              <Package className="h-4 w-4 mr-2" />
              Dabbawala Orders
            </TabsTrigger>
            <TabsTrigger value="restaurant" data-ocid="fare.restaurant.tab">
              <UtensilsCrossed className="h-4 w-4 mr-2" />
              Restaurant Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dabbawala" className="pt-4">
            <div className="mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <strong>Dabbawala:</strong> ₹{allRates.dabbawala.baseFare} base
              fare includes first {allRates.dabbawala.freeKm} km, then ₹
              {allRates.dabbawala.perKmRate}/km
            </div>
            <FareEditor
              rates={allRates.dabbawala}
              onChange={(r) => setAllRates({ ...allRates, dabbawala: r })}
            />
          </TabsContent>

          <TabsContent value="restaurant" className="pt-4">
            <div className="mb-3 p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-800">
              <strong>Restaurant:</strong> ₹{allRates.restaurant.baseFare} base
              fare includes first {allRates.restaurant.freeKm} km, then ₹
              {allRates.restaurant.perKmRate}/km
            </div>
            <FareEditor
              rates={allRates.restaurant}
              onChange={(r) => setAllRates({ ...allRates, restaurant: r })}
            />
          </TabsContent>
        </Tabs>

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
