import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  Package,
  Plus,
  Upload,
  UtensilsCrossed,
} from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import LazyImage from "../components/LazyImage";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateMeal,
  useGetRestaurantMeals,
  useGetRestaurantOrders,
  useGetRestaurantProfile,
  useUpdateMeal,
} from "../hooks/useQueries";
import { OrderStatusEnum } from "../types/local";
import type { Meal } from "../types/local";

export default function RestaurantApp() {
  const { identity } = useInternetIdentity();
  useGetRestaurantProfile();
  const { data: meals = [] } = useGetRestaurantMeals();
  const { data: orders = [] } = useGetRestaurantOrders();
  const createMeal = useCreateMeal();
  const updateMeal = useUpdateMeal();

  const [showAddMeal, setShowAddMeal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    price: "",
    portionLimit: "",
    available: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const activeOrders = orders.filter(
    (o) =>
      o.status !== OrderStatusEnum.delivered &&
      o.status !== OrderStatusEnum.cancelled,
  );
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0,
  );

  // Background prefetch for likely interactions
  useEffect(() => {
    // Prefetch meal images
    const prefetchTimer = setTimeout(() => {
      for (const meal of meals) {
        if (meal.image) {
          const img = new Image();
          img.src = meal.image.getDirectURL();
        }
      }
    }, 1000);

    return () => clearTimeout(prefetchTimer);
  }, [meals]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mealForm.name || !mealForm.description || !mealForm.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!identity) {
      toast.error("You must be logged in to create meals");
      return;
    }

    try {
      let imageBlob: ExternalBlob | undefined;

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
          (percentage) => {
            setUploadProgress(percentage);
          },
        );
      }

      const mealData: Meal = {
        id: editingMeal?.id || `meal-${Date.now()}`,
        restaurantId: identity.getPrincipal(),
        name: mealForm.name,
        description: mealForm.description,
        price: BigInt(mealForm.price),
        portionLimit: BigInt(mealForm.portionLimit || "10"),
        available: mealForm.available,
        image: imageBlob,
      };

      if (editingMeal) {
        await updateMeal.mutateAsync({
          mealId: editingMeal.id,
          meal: mealData,
        });
        toast.success("Meal updated successfully");
      } else {
        await createMeal.mutateAsync(mealData);
        toast.success("Meal created successfully");
      }

      setShowAddMeal(false);
      setEditingMeal(null);
      setMealForm({
        name: "",
        description: "",
        price: "",
        portionLimit: "",
        available: true,
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
    } catch (_error) {
      toast.error("Failed to save meal");
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      description: meal.description,
      price: meal.price.toString(),
      portionLimit: meal.portionLimit.toString(),
      available: meal.available,
    });
    if (meal.image) {
      setImagePreview(meal.image.getDirectURL());
    }
    setShowAddMeal(true);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Restaurant Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Manage your menu and orders
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-restaurant-600" />
              Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-restaurant-600">
              {meals.length}
            </div>
            <p className="text-sm text-muted-foreground">Total meals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-restaurant-600" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-restaurant-600">
              {activeOrders.length}
            </div>
            <p className="text-sm text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-restaurant-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-restaurant-600">
              ₹{totalRevenue}
            </div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menu" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Menu</h2>
            <Button onClick={() => setShowAddMeal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </div>

          {showAddMeal && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingMeal ? "Edit Meal" : "Add New Meal"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Meal Name</Label>
                    <Input
                      id="name"
                      value={mealForm.name}
                      onChange={(e) =>
                        setMealForm({ ...mealForm, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={mealForm.description}
                      onChange={(e) =>
                        setMealForm({
                          ...mealForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={mealForm.price}
                        onChange={(e) =>
                          setMealForm({ ...mealForm, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portionLimit">Portion Limit</Label>
                      <Input
                        id="portionLimit"
                        type="number"
                        value={mealForm.portionLimit}
                        onChange={(e) =>
                          setMealForm({
                            ...mealForm,
                            portionLimit: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Meal Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <LazyImage
                          src={imagePreview}
                          alt="Meal preview"
                          className="w-full h-48 object-cover rounded-lg"
                          priority
                        />
                      </div>
                    )}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-restaurant-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Uploading: {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={createMeal.isPending || updateMeal.isPending}
                    >
                      {createMeal.isPending || updateMeal.isPending
                        ? "Saving..."
                        : "Save Meal"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddMeal(false);
                        setEditingMeal(null);
                        setMealForm({
                          name: "",
                          description: "",
                          price: "",
                          portionLimit: "",
                          available: true,
                        });
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {meals.map((meal) => (
              <Card key={meal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <Badge variant={meal.available ? "default" : "secondary"}>
                      {meal.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <CardDescription>{meal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {meal.image && (
                    <LazyImage
                      src={meal.image.getDirectURL()}
                      alt={meal.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ₹{meal.price.toString()}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(meal)}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">
                  Orders will appear here when customers place them
                </p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <Badge
                      variant={
                        order.status === OrderStatusEnum.delivered
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Quantity: {order.quantity.toString()} | Total: ₹
                    {order.totalPrice.toString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
