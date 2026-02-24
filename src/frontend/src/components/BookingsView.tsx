import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import {
  useGetDabbaBookings,
  useCancelDabbaBookingByCustomer,
} from '../hooks/useQueries';
import { PickupSlotEnum, SubscriptionTypeEnum } from '../types/local';
import type { DabbaBooking } from '../types/local';
import { toast } from 'sonner';

export default function BookingsView() {
  const { data: bookings = [], isLoading } = useGetDabbaBookings();
  const cancelBooking = useCancelDabbaBookingByCustomer();
  const [selectedBooking, setSelectedBooking] = useState<DabbaBooking | null>(null);

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking.mutateAsync(bookingId);
      toast.success('Booking cancelled successfully');
      setSelectedBooking(null);
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const getSlotTimeText = (slot: PickupSlotEnum) => {
    return slot === PickupSlotEnum.morning ? '8:00 AM - 10:00 AM' : '10:00 AM - 12:00 PM';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
        <p className="text-muted-foreground mb-4">Start by booking your first dabba pickup</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Dabba Pickup</CardTitle>
                <CardDescription>Booking ID: {booking.id}</CardDescription>
              </div>
              <Badge variant={booking.status === 'delivered' ? 'default' : 'secondary'}>
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
              <span className="text-sm">{getSlotTimeText(booking.slotTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{booking.frequency}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBooking(booking)}
                disabled={booking.status === 'cancelled' || booking.status === 'delivered'}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(booking.id)}
                disabled={booking.status === 'cancelled' || booking.status === 'delivered' || cancelBooking.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Booking editing feature coming soon!</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
