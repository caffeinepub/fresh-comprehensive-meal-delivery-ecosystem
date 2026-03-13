import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Loader2, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeliveryBookingCard from "../components/DeliveryBookingCard";
import {
  useGetAssignedDabbaBookings,
  useGetAssignedOrders,
  useGetDeliveryProfile,
  useUpdateDabbaStatus,
  useUpdateDeliveryAvailability,
  useUpdateDeliveryStatus,
} from "../hooks/useQueries";
import { DabbaStatusEnum, DeliveryStatusEnum } from "../types/local";

export default function DeliveryApp() {
  const { data: profile, isLoading: profileLoading } = useGetDeliveryProfile();
  const { data: orders = [], isLoading: ordersLoading } =
    useGetAssignedOrders();
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useGetAssignedDabbaBookings();
  const updateAvailability = useUpdateDeliveryAvailability();
  const updateDeliveryStatus = useUpdateDeliveryStatus();
  const updateDabbaStatus = useUpdateDabbaStatus();

  const [isAvailable, setIsAvailable] = useState(profile?.available ?? true);

  const handleAvailabilityToggle = async (checked: boolean) => {
    try {
      await updateAvailability.mutateAsync(checked);
      setIsAvailable(checked);
      toast.success(
        checked ? "You are now available" : "You are now unavailable",
      );
    } catch {
      toast.error("Failed to update availability");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: DeliveryStatusEnum,
  ) => {
    try {
      await updateDeliveryStatus.mutateAsync({ orderId, status });
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: DabbaStatusEnum,
  ) => {
    try {
      await updateDabbaStatus.mutateAsync({ bookingId, status });
      toast.success("Booking status updated");
      refetchBookings();
    } catch {
      toast.error("Failed to update booking status");
    }
  };

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" => {
    if (status === "delivered") return "default";
    if (status === "cancelled") return "destructive";
    return "secondary";
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-delivery-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-delivery-50 to-blue-50">
      <header className="bg-white border-b border-delivery-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-delivery-600" />
              <div>
                <h1 className="text-2xl font-bold text-delivery-900">
                  Fresh Delivery
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {profile?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="availability" className="text-sm font-medium">
                {isAvailable ? "Available" : "Unavailable"}
              </Label>
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={handleAvailabilityToggle}
                disabled={updateAvailability.isPending}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Your Deliveries</h2>
          <p className="text-muted-foreground">
            Manage your assigned orders and dabba bookings
          </p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">
              Dabba Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              Meal Orders ({orders.length})
            </TabsTrigger>
          </TabsList>

          {/* Dabba Bookings tab - with PIN/QR */}
          <TabsContent value="bookings" className="space-y-4">
            {bookingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-delivery-600" />
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No dabba bookings assigned yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <DeliveryBookingCard
                  key={booking.id}
                  booking={booking}
                  onPickedUp={(id) =>
                    handleUpdateBookingStatus(id, DabbaStatusEnum.pickedUp)
                  }
                  onInTransit={(id) =>
                    handleUpdateBookingStatus(id, DabbaStatusEnum.inTransit)
                  }
                  onDelivered={(id) =>
                    handleUpdateBookingStatus(id, DabbaStatusEnum.delivered)
                  }
                />
              ))
            )}
          </TabsContent>

          {/* Meal orders tab */}
          <TabsContent value="orders" className="space-y-4">
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-delivery-600" />
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No orders assigned yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Order #{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Qty: {order.quantity.toString()}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(order.deliveryStatus)}>
                        {order.deliveryStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdateOrderStatus(
                          order.id,
                          DeliveryStatusEnum.pickedUp,
                        )
                      }
                      disabled={
                        order.deliveryStatus !== DeliveryStatusEnum.assigned
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Picked Up
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdateOrderStatus(
                          order.id,
                          DeliveryStatusEnum.delivered,
                        )
                      }
                      disabled={
                        order.deliveryStatus !== DeliveryStatusEnum.pickedUp
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Delivered
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-delivery-600">
                  ₹{profile?.totalEarnings?.toString() ?? "0"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Deliveries Completed
                </p>
                <p className="text-2xl font-bold text-delivery-600">
                  {profile?.deliveryCount?.toString() ?? "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white border-t border-delivery-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Fresh Delivery. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-delivery-600 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
