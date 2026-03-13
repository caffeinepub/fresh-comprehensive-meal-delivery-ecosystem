/**
 * Shown to the customer so they can verify the delivery person.
 * Also shown as a QR that the delivery person can scan.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, ShieldCheck } from "lucide-react";
import { buildBookingQrPayload, getPinFromId, getQrUrl } from "../lib/pinUtils";

interface BookingPinCardProps {
  bookingId: string;
  type?: "pickup" | "drop" | "both";
}

export default function BookingPinCard({
  bookingId,
  type = "both",
}: BookingPinCardProps) {
  const pin = getPinFromId(bookingId);
  const qrPayload = buildBookingQrPayload(bookingId);
  const qrUrl = getQrUrl(qrPayload, 160);

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-green-800">
          <ShieldCheck className="h-4 w-4" />
          Delivery Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <img
          src={qrUrl}
          alt="Booking QR"
          className="h-24 w-24 rounded border border-green-200 bg-white"
          data-ocid="booking.map_marker"
        />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Booking PIN</p>
          <p
            className="text-4xl font-mono font-bold tracking-widest text-green-700"
            data-ocid="booking.panel"
          >
            {pin}
          </p>
          <p className="text-xs text-muted-foreground">
            Share this PIN or QR with the delivery person{" "}
            {type === "pickup"
              ? "at pickup"
              : type === "drop"
                ? "at drop"
                : "for pickup & drop"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
