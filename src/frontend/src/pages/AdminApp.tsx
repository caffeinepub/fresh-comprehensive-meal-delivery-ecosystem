import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Download,
  IndianRupee,
  MessageSquare,
  Package,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";
import FareRatesManager from "../components/FareRatesManager";
import TwilioConfig from "../components/TwilioConfig";
import {
  useGetAllCustomers,
  useGetAllDeliveryPartners,
  useGetAllOrders,
  useGetAllRestaurants,
} from "../hooks/useQueries";

export default function AdminApp() {
  const { data: customers = [] } = useGetAllCustomers();
  const { data: restaurants = [] } = useGetAllRestaurants();
  const { data: deliveryPartners = [] } = useGetAllDeliveryPartners();
  const { data: orders = [] } = useGetAllOrders();

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0,
  );
  const activeRestaurants = restaurants.filter((r) => r.active).length;
  const availablePartners = deliveryPartners.filter((p) => p.available).length;

  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      console.log("[Prefetch] Admin dashboard data loaded in background");
    }, 1000);
    return () => clearTimeout(prefetchTimer);
  }, []);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data exported successfully");
  };

  const handleExportCustomers = () => {
    const data = customers.map((c) => ({
      ID: c.id.toString(),
      Name: c.name,
      Address: c.address,
      "Wallet Balance": c.walletBalance.toString(),
    }));
    exportToCSV(data, "customers");
  };

  const handleExportOrders = () => {
    const data = orders.map((o) => ({
      "Order ID": o.id,
      "Customer ID": o.customerId.toString(),
      "Restaurant ID": o.restaurantId.toString(),
      "Meal ID": o.mealId,
      Quantity: o.quantity.toString(),
      "Total Price": o.totalPrice.toString(),
      Status: o.status,
      "Delivery Status": o.deliveryStatus,
    }));
    exportToCSV(data, "orders");
  };

  const handleExportRestaurants = () => {
    const data = restaurants.map((r) => ({
      ID: r.id.toString(),
      Name: r.name,
      Description: r.description,
      "Operating Hours": r.operatingHours,
      Active: r.active ? "Yes" : "No",
    }));
    exportToCSV(data, "restaurants");
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Platform management and analytics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-admin-600" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-admin-600">
              {customers.length}
            </div>
            <p className="text-sm text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-admin-600" />
              Restaurants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-admin-600">
              {activeRestaurants}
            </div>
            <p className="text-sm text-muted-foreground">Active partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-admin-600" />
              Delivery Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-admin-600">
              {availablePartners}
            </div>
            <p className="text-sm text-muted-foreground">Available now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-admin-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-admin-600">
              ₹{totalRevenue}
            </div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="customers" data-ocid="admin.customers.tab">
            Customers
          </TabsTrigger>
          <TabsTrigger value="restaurants" data-ocid="admin.restaurants.tab">
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="delivery" data-ocid="admin.delivery.tab">
            Delivery
          </TabsTrigger>
          <TabsTrigger value="orders" data-ocid="admin.orders.tab">
            Orders
          </TabsTrigger>
          <TabsTrigger value="fares" data-ocid="admin.fares.tab">
            <IndianRupee className="h-4 w-4 mr-1" />
            Fares
          </TabsTrigger>
          <TabsTrigger value="settings" data-ocid="admin.settings.tab">
            <MessageSquare className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Customer Management</h2>
            <Button
              onClick={handleExportCustomers}
              variant="outline"
              data-ocid="admin.customers.button"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
          <div className="grid gap-4" data-ocid="admin.customers.list">
            {customers.length === 0 ? (
              <Card data-ocid="admin.customers.empty_state">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No customers registered yet
                </CardContent>
              </Card>
            ) : (
              customers.map((customer, i) => (
                <Card
                  key={customer.id.toString()}
                  data-ocid={`admin.customers.item.${i + 1}`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <CardDescription>{customer.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Wallet: ₹{customer.walletBalance.toString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {customer.id.toString().slice(0, 10)}...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Restaurant Management</h2>
            <Button
              onClick={handleExportRestaurants}
              variant="outline"
              data-ocid="admin.restaurants.button"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
          <div className="grid gap-4">
            {restaurants.length === 0 ? (
              <Card data-ocid="admin.restaurants.empty_state">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No restaurants registered yet
                </CardContent>
              </Card>
            ) : (
              restaurants.map((restaurant, i) => (
                <Card
                  key={restaurant.id.toString()}
                  data-ocid={`admin.restaurants.item.${i + 1}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {restaurant.name}
                      </CardTitle>
                      <Badge
                        variant={restaurant.active ? "default" : "secondary"}
                      >
                        {restaurant.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{restaurant.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {restaurant.operatingHours}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <h2 className="text-2xl font-bold">Delivery Partner Management</h2>
          <div className="grid gap-4">
            {deliveryPartners.length === 0 ? (
              <Card data-ocid="admin.delivery.empty_state">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No delivery partners registered yet
                </CardContent>
              </Card>
            ) : (
              deliveryPartners.map((partner, i) => (
                <Card
                  key={partner.id.toString()}
                  data-ocid={`admin.delivery.item.${i + 1}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <Badge
                        variant={partner.available ? "default" : "secondary"}
                      >
                        {partner.available ? "Available" : "Offline"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Earnings: ₹{partner.totalEarnings.toString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Deliveries: {partner.deliveryCount.toString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Order Management</h2>
            <Button
              onClick={handleExportOrders}
              variant="outline"
              data-ocid="admin.orders.button"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
          <div className="grid gap-4">
            {orders.length === 0 ? (
              <Card data-ocid="admin.orders.empty_state">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No orders placed yet
                </CardContent>
              </Card>
            ) : (
              orders.map((order, i) => (
                <Card key={order.id} data-ocid={`admin.orders.item.${i + 1}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <Badge>{order.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>{order.quantity.toString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-semibold">
                          ₹{order.totalPrice.toString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Delivery Status:
                        </span>
                        <Badge variant="outline">{order.deliveryStatus}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="fares" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Fare Rate Management</h2>
          <FareRatesManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">System Settings</h2>
          <TwilioConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}
