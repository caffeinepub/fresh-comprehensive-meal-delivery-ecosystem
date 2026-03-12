import { l as useGetMeals, m as usePlaceOrder, r as reactExports, S as SubscriptionTypeEnum, j as jsxRuntimeExports, C as Card, e as CardContent, U as UtensilsCrossed, B as Button, a as CardHeader, b as CardTitle, d as CardDescription, n as Badge, L as Label, I as Input, h as Calendar, k as ue } from "./index-CJ4HkvNi.js";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-Dt48wGdr.js";
function MealPlanFlow({
  onComplete,
  onCancel
}) {
  const { data: meals = [], isLoading } = useGetMeals();
  const placeOrder = usePlaceOrder();
  const [selectedMeal, setSelectedMeal] = reactExports.useState(null);
  const [subscriptionType, setSubscriptionType] = reactExports.useState(SubscriptionTypeEnum.none);
  const [quantity, setQuantity] = reactExports.useState("1");
  const handleOrder = async () => {
    if (!selectedMeal) {
      ue.error("Please select a meal");
      return;
    }
    try {
      await placeOrder.mutateAsync({
        mealId: selectedMeal.id,
        quantity: BigInt(quantity),
        subscriptionType,
        scheduledDate: null
      });
      ue.success("Order placed successfully!");
      onComplete();
    } catch (_error) {
      ue.error("Failed to place order");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading meals..." })
    ] }) });
  }
  if (meals.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-2xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UtensilsCrossed, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No meals available" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Check back later for delicious home-cooked meals" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onCancel, children: "Go Back" })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container max-w-4xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Browse Meals" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Select a meal and choose your subscription plan" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2", children: meals.map((meal) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: `cursor-pointer transition-colors ${(selectedMeal == null ? void 0 : selectedMeal.id) === meal.id ? "border-fresh-600 bg-fresh-50/50" : ""}`,
          onClick: () => setSelectedMeal(meal),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: meal.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: meal.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold", children: [
                "₹",
                meal.price.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: meal.available ? "default" : "secondary", children: meal.available ? "Available" : "Unavailable" })
            ] }) })
          ]
        },
        meal.id
      )) }),
      selectedMeal && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "quantity", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "quantity",
              type: "number",
              min: "1",
              value: quantity,
              onChange: (e) => setQuantity(e.target.value),
              className: "max-w-xs"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "inline h-4 w-4 mr-2" }),
            "Subscription Type"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            RadioGroup,
            {
              value: subscriptionType,
              onValueChange: (value) => setSubscriptionType(value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: SubscriptionTypeEnum.none,
                      id: "none"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "none", className: "flex-1 cursor-pointer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "One-time Order" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Order once" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: SubscriptionTypeEnum.daily,
                      id: "sub-daily"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "sub-daily",
                      className: "flex-1 cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Daily Subscription" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Monday to Friday" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RadioGroupItem,
                    {
                      value: SubscriptionTypeEnum.weekly,
                      id: "sub-weekly"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "sub-weekly",
                      className: "flex-1 cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Weekly Subscription" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Once a week" })
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleOrder,
            disabled: !selectedMeal || placeOrder.isPending,
            className: "flex-1",
            children: placeOrder.isPending ? "Placing Order..." : "Place Order"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onCancel, children: "Cancel" })
      ] })
    ] })
  ] }) });
}
export {
  MealPlanFlow as default
};
