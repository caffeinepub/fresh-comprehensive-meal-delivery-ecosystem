import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Download,
  Edit,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BookingPinCard from "../components/BookingPinCard";
import { useBookingNotifications } from "../hooks/useBookingNotifications";
import {
  useCancelDabbaBookingByCustomer,
  useGetMyDabbaBookings,
  useUpdateBooking,
} from "../hooks/useQueries";
import {
  DabbaStatusEnum,
  PickupSlotEnum,
  SubscriptionTypeEnum,
} from "../types/local";
import type { DabbaBooking } from "../types/local";
import { downloadAsCSV } from "../utils/csvExport";

export default function BookingsView() {
  const { data: bookings = [], isLoading } = useGetMyDabbaBookings();
  const cancelBooking = useCancelDabbaBookingByCustomer();
  const updateBooking = useUpdateBooking();
  const [selectedBooking, setSelectedBooking] = useState<DabbaBooking | null>(
    null,
  );
  const [editForm, setEditForm] = useState({
    pickupAddress: "",
    dropAddress: "",
    slotTime: PickupSlotEnum.morning,
    frequency: SubscriptionTypeEnum.daily,
  });

  useBookingNotifications(bookings);

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking.mutateAsync(bookingId);
      toast.success("Booking cancelled successfully");
      setSelectedBooking(null);
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  const handleEdit = (booking: DabbaBooking) => {
    setSelectedBooking(booking);
    setEditForm({
      pickupAddress: booking.pickupAddress,
      dropAddress: booking.dropAddress,
      slotTime: booking.slotTime,
      frequency: booking.frequency,
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedBooking) return;
    try {
      const updatedBooking: DabbaBooking = {
        ...selectedBooking,
        pickupAddress: editForm.pickupAddress,
        dropAddress: editForm.dropAddress,
        slotTime: editForm.slotTime,
        frequency: editForm.frequency,
      };
      await updateBooking.mutateAsync(updatedBooking);
      toast.success("Booking updated successfully");
      setSelectedBooking(null);
    } catch {
      toast.error("Failed to update booking");
    }
  };

  const handleDownload = () => {
    if (bookings.length === 0) {
      toast.error("No bookings to download");
      return;
    }
    const exportData = bookings.map((b, i) => ({
      "#": i + 1,
      "Booking ID": b.id,
      "Pickup Address": b.pickupAddress,
      "Drop Address": b.dropAddress,
      "Time Slot":
        b.slotTime === PickupSlotEnum.morning ? "8AM-10AM" : "10AM-12PM",
      Frequency: b.frequency,
      Status: b.status,
    }));
    downloadAsCSV(
      exportData,
      `fresh-bookings-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    toast.success("Bookings exported!");
  };

  const getSlotTimeText = (slot: PickupSlotEnum) =>
    slot === PickupSlotEnum.morning
      ? "8:00 AM - 10:00 AM"
      : "10:00 AM - 12:00 PM";

  const getStatusVariant = (
    status: DabbaStatusEnum,
  ): "default" | "secondary" | "destructive" => {
    if (status === DabbaStatusEnum.delivered) return "default";
    if (status === DabbaStatusEnum.cancelled) return "destructive";
    return "secondary";
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-12"
        data-ocid="bookings.loading_state"
      >
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12" data-ocid="bookings.empty_state">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by booking your first dabba pickup
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          data-ocid="bookings.secondary_button"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Bookings
        </Button>
      </div>

      {bookings.map((booking, index) => (
        <Card key={booking.id} data-ocid={`bookings.item.${index + 1}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Dabba Pickup</CardTitle>
                <CardDescription>
                  Booking ID: {booking.id.slice(0, 12)}...
                </CardDescription>
              </div>
              <Badge variant={getStatusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Pickup</div>
                <div className="font-medium">{booking.pickupAddress}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">Drop</div>
                <div className="font-medium">{booking.dropAddress}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {getSlotTimeText(booking.slotTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{booking.frequency}</span>
            </div>

            {/* PIN Card for active bookings */}
            {booking.status !== DabbaStatusEnum.cancelled &&
              booking.status !== DabbaStatusEnum.delivered && (
                <BookingPinCard bookingId={booking.id} type="both" />
              )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(booking)}
                disabled={
                  booking.status === DabbaStatusEnum.cancelled ||
                  booking.status === DabbaStatusEnum.delivered
                }
                data-ocid={`bookings.edit_button.${index + 1}`}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(booking.id)}
                disabled={
                  booking.status === DabbaStatusEnum.cancelled ||
                  booking.status === DabbaStatusEnum.delivered ||
                  cancelBooking.isPending
                }
                data-ocid={`bookings.delete_button.${index + 1}`}
              >
                {cancelBooking.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={!!selectedBooking}
        onOpenChange={() => setSelectedBooking(null)}
      >
        <DialogContent className="sm:max-w-[500px]" data-ocid="bookings.dialog">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Pickup Address</Label>
              <Input
                id="pickupAddress"
                value={editForm.pickupAddress}
                onChange={(e) =>
                  setEditForm({ ...editForm, pickupAddress: e.target.value })
                }
                placeholder="Enter pickup address"
                data-ocid="bookings.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropAddress">Drop Address</Label>
              <Input
                id="dropAddress"
                value={editForm.dropAddress}
                onChange={(e) =>
                  setEditForm({ ...editForm, dropAddress: e.target.value })
                }
                placeholder="Enter drop address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slotTime">Time Slot</Label>
              <Select
                value={editForm.slotTime}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    slotTime: value as PickupSlotEnum,
                  })
                }
              >
                <SelectTrigger id="slotTime" data-ocid="bookings.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PickupSlotEnum.morning}>
                    8:00 AM - 10:00 AM
                  </SelectItem>
                  <SelectItem value={PickupSlotEnum.midMorning}>
                    10:00 AM - 12:00 PM
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={editForm.frequency}
                onValueChange={(value) =>
                  setEditForm({
                    ...editForm,
                    frequency: value as SubscriptionTypeEnum,
                  })
                }
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SubscriptionTypeEnum.none}>
                    One-time
                  </SelectItem>
                  <SelectItem value={SubscriptionTypeEnum.daily}>
                    Daily
                  </SelectItem>
                  <SelectItem value={SubscriptionTypeEnum.weekly}>
                    Weekly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedBooking(null)}
              data-ocid="bookings.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={
                updateBooking.isPending ||
                !editForm.pickupAddress ||
                !editForm.dropAddress
              }
              data-ocid="bookings.save_button"
            >
              {updateBooking.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
