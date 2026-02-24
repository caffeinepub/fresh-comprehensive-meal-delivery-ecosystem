import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Package, Truck, DollarSign, MapPin } from 'lucide-react';
import {
  useGetDeliveryProfile,
  useUpdateDeliveryAvailability,
  useGetAssignedOrders,
  useGetAssignedDabbaBookings,
  useUpdateDeliveryStatus,
  useUpdateDabbaStatus,
} from '../hooks/useQueries';
import { DeliveryStatusEnum, DabbaStatusEnum } from '../types/local';
import { toast } from 'sonner';

export default function EmployeeApp() {
  const { data: profile } = useGetDeliveryProfile();
  const { data: orders = [] } = useGetAssignedOrders();
  const { data: bookings = [] } = useGetAssignedDabbaBookings();
  const updateAvailability = useUpdateDeliveryAvailability();
  const updateDeliveryStatus = useUpdateDeliveryStatus();
  const updateDabbaStatus = useUpdateDabbaStatus();

  const [isAvailable, setIsAvailable] = useState(profile?.available || false);

  useEffect(() => {
    if (profile) {
      setIsAvailable(profile.available);
    }
  }, [profile]);

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      await updateAvailability.mutateAsync(checked);
      setIsAvailable(checked);
      toast.success(checked ? 'You are now available for deliveries' : 'You are now offline');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleUpdateDeliveryStatus = async (orderId: string, status: DeliveryStatusEnum) => {
    try {
      await updateDeliveryStatus.mutateAsync({ orderId, status });
      toast.success('Delivery status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateDabbaStatus = async (bookingId: string, status: DabbaStatusEnum) => {
    try {
      await updateDabbaStatus.mutateAsync({ bookingId, status });
      toast.success('Booking status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const activeOrders = orders.filter(
    (o) => o.deliveryStatus !== DeliveryStatusEnum.delivered && o.deliveryStatus !== DeliveryStatusEnum.cancelled
  );
  const activeBookings = bookings.filter(
    (b) => b.status !== DabbaStatusEnum.delivered && b.status !== DabbaStatusEnum.cancelled
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Delivery Executive Portal</h1>
        <p className="text-xl text-muted-foreground">Manage your deliveries and earnings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-delivery-600" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
                disabled={updateAvailability.isPending}
              />
              <Label htmlFor="availability" className="cursor-pointer">
                {isAvailable ? 'Available' : 'Offline'}
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-delivery-600" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-delivery-600">{activeOrders.length}</div>
            <p className="text-sm text-muted-foreground">Meal deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-delivery-600" />
              Active Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-delivery-600">{activeBookings.length}</div>
            <p className="text-sm text-muted-foreground">Dabba pickups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-delivery-600" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-delivery-600">
              ₹{profile?.totalEarnings?.toString() || '0'}
            </div>
            <p className="text-sm text-muted-foreground">
              {profile?.deliveryCount?.toString() || '0'} deliveries
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders">Meal Orders</TabsTrigger>
          <TabsTrigger value="bookings">Dabba Pickups</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <h2 className="text-2xl font-bold">Assigned Meal Orders</h2>
          <div className="grid gap-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No orders assigned yet
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <Badge>{order.deliveryStatus}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span>{order.quantity.toString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-semibold">₹{order.totalPrice.toString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {order.deliveryStatus === DeliveryStatusEnum.assigned && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateDeliveryStatus(order.id, DeliveryStatusEnum.pickedUp)}
                            disabled={updateDeliveryStatus.isPending}
                          >
                            Mark Picked Up
                          </Button>
                        )}
                        {order.deliveryStatus === DeliveryStatusEnum.pickedUp && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateDeliveryStatus(order.id, DeliveryStatusEnum.inTransit)}
                            disabled={updateDeliveryStatus.isPending}
                          >
                            In Transit
                          </Button>
                        )}
                        {order.deliveryStatus === DeliveryStatusEnum.inTransit && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateDeliveryStatus(order.id, DeliveryStatusEnum.delivered)}
                            disabled={updateDeliveryStatus.isPending}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <h2 className="text-2xl font-bold">Assigned Dabba Pickups</h2>
          <div className="grid gap-4">
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No bookings assigned yet
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Booking #{booking.id.slice(0, 8)}</CardTitle>
                      <Badge>{booking.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pickup: </span>
                          <span>{booking.pickupAddress}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Drop: </span>
                          <span>{booking.dropAddress}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Slot: </span>
                          <span className="capitalize">{booking.slotTime}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === DabbaStatusEnum.pending && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateDabbaStatus(booking.id, DabbaStatusEnum.pickedUp)}
                            disabled={updateDabbaStatus.isPending}
                          >
                            Mark Picked Up
                          </Button>
                        )}
                        {booking.status === DabbaStatusEnum.pickedUp && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateDabbaStatus(booking.id, DabbaStatusEnum.inTransit)}
                            disabled={updateDabbaStatus.isPending}
                          >
                            In Transit
                          </Button>
                        )}
                        {booking.status === DabbaStatusEnum.inTransit && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateDabbaStatus(booking.id, DabbaStatusEnum.delivered)}
                            disabled={updateDabbaStatus.isPending}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
