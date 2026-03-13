/**
 * Delivery app: card for a single dabba booking with PIN + QR.
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, QrCode } from "lucide-react";
import { useState } from "react";
import { buildBookingQrPayload, getPinFromId, getQrUrl } from "../lib/pinUtils";
import { DabbaStatusEnum, PickupSlotEnum } from "../types/local";

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" {
  if (status === "delivered") return "default";
  if (status === "cancelled") return "destructive";
  return "secondary";
}

interface Props {
  booking: {
    id: string;
    pickupAddress: string;
    dropAddress: string;
    slotTime: PickupSlotEnum;
    status: DabbaStatusEnum;
  };
  onPickedUp: (id: string) => void;
  onInTransit: (id: string) => void;
  onDelivered: (id: string) => void;
}

export default function DeliveryBookingCard({
  booking,
  onPickedUp,
  onInTransit,
  onDelivered,
}: Props) {
  const [showQr, setShowQr] = useState(false);
  const pin = getPinFromId(booking.id);
  const qrUrl = getQrUrl(buildBookingQrPayload(booking.id), 160);
  const slotText =
    booking.slotTime === PickupSlotEnum.morning
      ? "8:00 AM - 10:00 AM"
      : "10:00 AM - 12:00 PM";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Dabba Pickup</CardTitle>
            <CardDescription>
              Booking ID: {booking.id.slice(0, 10)}...
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Addresses */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-500 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Pickup</p>
              <p className="font-medium text-sm">{booking.pickupAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-red-500 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Drop</p>
              <p className="font-medium text-sm">{booking.dropAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{slotText}</span>
          </div>
        </div>

        {/* PIN + QR */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Booking PIN</p>
              <p
                className="text-2xl font-mono font-bold tracking-widest text-blue-800"
                data-ocid="delivery.panel"
              >
                {pin}
              </p>
              <p className="text-xs text-blue-500">
                Ask customer to confirm this PIN
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-700"
              onClick={() => setShowQr(!showQr)}
              data-ocid="delivery.qr_button"
            >
              <QrCode className="h-4 w-4 mr-1" />
              {showQr ? "Hide QR" : "Show QR"}
            </Button>
          </div>
          {showQr && (
            <div className="flex justify-center pt-1">
              <img
                src={qrUrl}
                alt="Booking QR code"
                className="h-40 w-40 rounded border bg-white"
                data-ocid="delivery.map_marker"
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => onPickedUp(booking.id)}
            disabled={booking.status !== DabbaStatusEnum.pending}
            data-ocid="delivery.pickup_button"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Picked Up
          </Button>
          <Button
            size="sm"
            onClick={() => onInTransit(booking.id)}
            disabled={booking.status !== DabbaStatusEnum.pickedUp}
            data-ocid="delivery.transit_button"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            In Transit
          </Button>
          <Button
            size="sm"
            onClick={() => onDelivered(booking.id)}
            disabled={booking.status !== DabbaStatusEnum.inTransit}
            data-ocid="delivery.delivered_button"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Delivered
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
