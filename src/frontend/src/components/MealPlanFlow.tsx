import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, UtensilsCrossed } from 'lucide-react';
import { useGetMeals, usePlaceOrder } from '../hooks/useQueries';
import { SubscriptionTypeEnum } from '../types/local';
import type { Meal } from '../types/local';
import { toast } from 'sonner';

interface MealPlanFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function MealPlanFlow({ onComplete, onCancel }: MealPlanFlowProps) {
  const { data: meals = [], isLoading } = useGetMeals();
  const placeOrder = usePlaceOrder();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionTypeEnum>(SubscriptionTypeEnum.none);
  const [quantity, setQuantity] = useState('1');

  const handleOrder = async () => {
    if (!selectedMeal) {
      toast.error('Please select a meal');
      return;
    }

    try {
      await placeOrder.mutateAsync({
        mealId: selectedMeal.id,
        quantity: BigInt(quantity),
        subscriptionType,
        scheduledDate: null,
      });
      toast.success('Order placed successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading meals...</p>
        </div>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No meals available</h3>
            <p className="text-muted-foreground mb-4">Check back later for delicious home-cooked meals</p>
            <Button onClick={onCancel}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Browse Meals</CardTitle>
          <CardDescription>Select a meal and choose your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {meals.map((meal) => (
              <Card
                key={meal.id}
                className={`cursor-pointer transition-colors ${
                  selectedMeal?.id === meal.id ? 'border-fresh-600 bg-fresh-50/50' : ''
                }`}
                onClick={() => setSelectedMeal(meal)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{meal.name}</CardTitle>
                  <CardDescription>{meal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">₹{meal.price.toString()}</span>
                    <Badge variant={meal.available ? 'default' : 'secondary'}>
                      {meal.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedMeal && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-3">
                <Label>
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Subscription Type
                </Label>
                <RadioGroup
                  value={subscriptionType}
                  onValueChange={(value) => setSubscriptionType(value as SubscriptionTypeEnum)}
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={SubscriptionTypeEnum.none} id="none" />
                    <Label htmlFor="none" className="flex-1 cursor-pointer">
                      <div className="font-medium">One-time Order</div>
                      <div className="text-sm text-muted-foreground">Order once</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={SubscriptionTypeEnum.daily} id="sub-daily" />
                    <Label htmlFor="sub-daily" className="flex-1 cursor-pointer">
                      <div className="font-medium">Daily Subscription</div>
                      <div className="text-sm text-muted-foreground">Monday to Friday</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={SubscriptionTypeEnum.weekly} id="sub-weekly" />
                    <Label htmlFor="sub-weekly" className="flex-1 cursor-pointer">
                      <div className="font-medium">Weekly Subscription</div>
                      <div className="text-sm text-muted-foreground">Once a week</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleOrder} disabled={!selectedMeal || placeOrder.isPending} className="flex-1">
              {placeOrder.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
