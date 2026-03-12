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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetCustomerOrders, useSubmitReview } from "../hooks/useQueries";
import { SubscriptionTypeEnum } from "../types/local";
import type { Order } from "../types/local";

export default function OrdersView() {
  const { data: orders = [], isLoading } = useGetCustomerOrders();
  const submitReview = useSubmitReview();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmitReview = async () => {
    if (!selectedOrder) return;

    try {
      await submitReview.mutateAsync({
        mealId: selectedOrder.mealId,
        rating: BigInt(rating),
        comment,
      });
      toast.success("Review submitted successfully!");
      setSelectedOrder(null);
      setRating(5);
      setComment("");
    } catch (_error) {
      toast.error("Failed to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by ordering your first meal
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <CardDescription>Meal ID: {order.mealId}</CardDescription>
              </div>
              <Badge
                variant={order.status === "delivered" ? "default" : "secondary"}
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quantity</span>
              <span className="font-medium">{order.quantity.toString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Price</span>
              <span className="font-medium">
                ₹{order.totalPrice.toString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Subscription
              </span>
              <span className="font-medium capitalize">
                {order.subscriptionType}
              </span>
            </div>
            {order.status === "delivered" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order)}
                className="w-full mt-2"
              >
                <Star className="h-4 w-4 mr-2" />
                Leave a Review
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <Button
              onClick={handleSubmitReview}
              disabled={submitReview.isPending}
              className="w-full"
            >
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
