import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, C as Card, a as CardHeader, b as CardTitle, d as CardDescription, e as CardContent, B as Button, f as ue } from "./index-BfIGtKmp.js";
import { B as Badge } from "./badge-D8WDHAry.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-DWLsUv_A.js";
import { L as Label } from "./label-CvVyz3q6.js";
import { T as Textarea } from "./textarea-DATyN0LN.js";
import { e as useGetCustomerOrders, y as useSubmitReview } from "./useQueries-BReyyw8I.js";
import { P as Package } from "./package-BfaQt1xr.js";
import "./useActor-ClP9Ae-Z.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode);
function OrdersView() {
  const { data: orders = [], isLoading } = useGetCustomerOrders();
  const submitReview = useSubmitReview();
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [rating, setRating] = reactExports.useState(5);
  const [comment, setComment] = reactExports.useState("");
  const handleSubmitReview = async () => {
    if (!selectedOrder) return;
    try {
      await submitReview.mutateAsync({
        mealId: selectedOrder.mealId,
        rating: BigInt(rating),
        comment
      });
      ue.success("Review submitted successfully!");
      setSelectedOrder(null);
      setRating(5);
      setComment("");
    } catch (_error) {
      ue.error("Failed to submit review");
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Loading orders..." })
    ] }) });
  }
  if (orders.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "No orders yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Start by ordering your first meal" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg", children: [
            "Order #",
            order.id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Meal ID: ",
            order.mealId
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: order.status === "delivered" ? "default" : "secondary",
            children: order.status
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: order.quantity.toString() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Total Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            "₹",
            order.totalPrice.toString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Subscription" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium capitalize", children: order.subscriptionType })
        ] }),
        order.status === "delivered" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setSelectedOrder(order),
            className: "w-full mt-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 mr-2" }),
              "Leave a Review"
            ]
          }
        )
      ] })
    ] }, order.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!selectedOrder,
        onOpenChange: () => setSelectedOrder(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Leave a Review" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Rating" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((value) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRating(value),
                  className: "focus:outline-none",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Star,
                    {
                      className: `h-8 w-8 ${value <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`
                    }
                  )
                },
                value
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "comment", children: "Comment" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "comment",
                  placeholder: "Share your experience...",
                  value: comment,
                  onChange: (e) => setComment(e.target.value),
                  rows: 4
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSubmitReview,
                disabled: submitReview.isPending,
                className: "w-full",
                children: submitReview.isPending ? "Submitting..." : "Submit Review"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  OrdersView as default
};
