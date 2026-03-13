import { u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, C as Card, a as CardHeader, b as CardTitle, U as UtensilsCrossed, e as CardContent, B as Button, L as LazyImage, d as CardDescription, f as ue, E as ExternalBlob } from "./index-BfIGtKmp.js";
import { B as Badge } from "./badge-D8WDHAry.js";
import { I as Input } from "./input-Cv-sn70i.js";
import { L as Label } from "./label-CvVyz3q6.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-D-ln3Msz.js";
import { T as Textarea } from "./textarea-DATyN0LN.js";
import { m as useGetRestaurantProfile, n as useGetRestaurantMeals, o as useGetRestaurantOrders, p as useCreateMeal, q as useUpdateMeal, O as OrderStatusEnum } from "./useQueries-BReyyw8I.js";
import { P as Package } from "./package-BfaQt1xr.js";
import { D as DollarSign } from "./dollar-sign-BVX9HEee.js";
import { P as Plus } from "./plus-C1K47GTK.js";
import "./useActor-ClP9Ae-Z.js";
function RestaurantApp() {
  const { identity } = useInternetIdentity();
  useGetRestaurantProfile();
  const { data: meals = [] } = useGetRestaurantMeals();
  const { data: orders = [] } = useGetRestaurantOrders();
  const createMeal = useCreateMeal();
  const updateMeal = useUpdateMeal();
  const [showAddMeal, setShowAddMeal] = reactExports.useState(false);
  const [editingMeal, setEditingMeal] = reactExports.useState(null);
  const [mealForm, setMealForm] = reactExports.useState({
    name: "",
    description: "",
    price: "",
    portionLimit: "",
    available: true
  });
  const [imageFile, setImageFile] = reactExports.useState(null);
  const [imagePreview, setImagePreview] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const activeOrders = orders.filter(
    (o) => o.status !== OrderStatusEnum.delivered && o.status !== OrderStatusEnum.cancelled
  );
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice),
    0
  );
  reactExports.useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      for (const meal of meals) {
        if (meal.image) {
          const img = new Image();
          img.src = meal.image.getDirectURL();
        }
      }
    }, 1e3);
    return () => clearTimeout(prefetchTimer);
  }, [meals]);
  const handleImageChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        ue.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        ue.error("Please select an image file");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealForm.name || !mealForm.description || !mealForm.price) {
      ue.error("Please fill in all required fields");
      return;
    }
    if (!identity) {
      ue.error("You must be logged in to create meals");
      return;
    }
    try {
      let imageBlob;
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
          (percentage) => {
            setUploadProgress(percentage);
          }
        );
      }
      const mealData = {
        id: (editingMeal == null ? void 0 : editingMeal.id) || `meal-${Date.now()}`,
        restaurantId: identity.getPrincipal(),
        name: mealForm.name,
        description: mealForm.description,
        price: BigInt(mealForm.price),
        portionLimit: BigInt(mealForm.portionLimit || "10"),
        available: mealForm.available,
        image: imageBlob
      };
      if (editingMeal) {
        await updateMeal.mutateAsync({
          mealId: editingMeal.id,
          meal: mealData
        });
        ue.success("Meal updated successfully");
      } else {
        await createMeal.mutateAsync(mealData);
        ue.success("Meal created successfully");
      }
      setShowAddMeal(false);
      setEditingMeal(null);
      setMealForm({
        name: "",
        description: "",
        price: "",
        portionLimit: "",
        available: true
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
    } catch (_error) {
      ue.error("Failed to save meal");
    }
  };
  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setMealForm({
      name: meal.name,
      description: meal.description,
      price: meal.price.toString(),
      portionLimit: meal.portionLimit.toString(),
      available: meal.available
    });
    if (meal.image) {
      setImagePreview(meal.image.getDirectURL());
    }
    setShowAddMeal(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container max-w-6xl mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-2", children: "Restaurant Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground", children: "Manage your menu and orders" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-3 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-5 w-5 text-restaurant-600" }),
          "Menu Items"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-restaurant-600", children: meals.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total meals" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-restaurant-600" }),
          "Active Orders"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-restaurant-600", children: activeOrders.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "In progress" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-restaurant-600" }),
          "Total Revenue"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-restaurant-600", children: [
            "₹",
            totalRevenue
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "All time" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "menu", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "menu", children: "Menu Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "orders", children: "Orders" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "menu", className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: "Your Menu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setShowAddMeal(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Add Meal"
          ] })
        ] }),
        showAddMeal && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: editingMeal ? "Edit Meal" : "Add New Meal" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Meal Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "name",
                  value: mealForm.name,
                  onChange: (e) => setMealForm({ ...mealForm, name: e.target.value }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "description",
                  value: mealForm.description,
                  onChange: (e) => setMealForm({
                    ...mealForm,
                    description: e.target.value
                  }),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "price", children: "Price (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "price",
                    type: "number",
                    value: mealForm.price,
                    onChange: (e) => setMealForm({ ...mealForm, price: e.target.value }),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "portionLimit", children: "Portion Limit" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "portionLimit",
                    type: "number",
                    value: mealForm.portionLimit,
                    onChange: (e) => setMealForm({
                      ...mealForm,
                      portionLimit: e.target.value
                    })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "image", children: "Meal Image" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "image",
                  type: "file",
                  accept: "image/*",
                  onChange: handleImageChange
                }
              ),
              imagePreview && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                LazyImage,
                {
                  src: imagePreview,
                  alt: "Meal preview",
                  className: "w-full h-48 object-cover rounded-lg",
                  priority: true
                }
              ) }),
              uploadProgress > 0 && uploadProgress < 100 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "bg-restaurant-600 h-2 rounded-full transition-all",
                    style: { width: `${uploadProgress}%` }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                  "Uploading: ",
                  uploadProgress,
                  "%"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: createMeal.isPending || updateMeal.isPending,
                  children: createMeal.isPending || updateMeal.isPending ? "Saving..." : "Save Meal"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    setShowAddMeal(false);
                    setEditingMeal(null);
                    setMealForm({
                      name: "",
                      description: "",
                      price: "",
                      portionLimit: "",
                      available: true
                    });
                    setImageFile(null);
                    setImagePreview(null);
                  },
                  children: "Cancel"
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: meals.map((meal) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: meal.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: meal.available ? "default" : "secondary", children: meal.available ? "Available" : "Unavailable" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: meal.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            meal.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
              LazyImage,
              {
                src: meal.image.getDirectURL(),
                alt: meal.name,
                className: "w-full h-48 object-cover rounded-lg"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold", children: [
                "₹",
                meal.price.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => handleEdit(meal),
                  children: "Edit"
                }
              )
            ] })
          ] })
        ] }, meal.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "orders", className: "space-y-4", children: orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No orders yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Orders will appear here when customers place them" })
      ] }) }) : orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg", children: [
            "Order #",
            order.id.slice(0, 8)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: order.status === OrderStatusEnum.delivered ? "default" : "secondary",
              children: order.status
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Quantity: ",
          order.quantity.toString(),
          " | Total: ₹",
          order.totalPrice.toString()
        ] })
      ] }) }, order.id)) })
    ] })
  ] });
}
export {
  RestaurantApp as default
};
