import { useState, lazy, Suspense, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Package, UtensilsCrossed, Plus } from 'lucide-react';
import { useGetDabbaBookings, useGetCustomerOrders } from '../hooks/useQueries';
import { DabbaStatusEnum, OrderStatusEnum } from '../types/local';

// Lazy load heavy components for better initial load
const BookingFlow = lazy(() => import('../components/BookingFlow'));
const MealPlanFlow = lazy(() => import('../components/MealPlanFlow'));
const BookingsView = lazy(() => import('../components/BookingsView'));
const OrdersView = lazy(() => import('../components/OrdersView'));

type View = 'home' | 'booking' | 'mealPlan' | 'bookings' | 'orders';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-fresh-600 border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [prefetchedViews, setPrefetchedViews] = useState<Set<View>>(new Set());
  const { data: bookings = [] } = useGetDabbaBookings();
  const { data: orders = [] } = useGetCustomerOrders();

  const todayBookings = bookings.filter(
    (b) => b.status === DabbaStatusEnum.pending || b.status === DabbaStatusEnum.pickedUp
  );
  const activeOrders = orders.filter(
    (o) => o.status !== OrderStatusEnum.delivered && o.status !== OrderStatusEnum.cancelled
  );

  // Background prefetch for likely next screens
  useEffect(() => {
    // Prefetch booking and meal plan flows after initial render
    const prefetchTimer = setTimeout(() => {
      if (!prefetchedViews.has('booking')) {
        import('../components/BookingFlow').then(() => {
          setPrefetchedViews(prev => new Set(prev).add('booking'));
          console.log('[Prefetch] BookingFlow loaded in background');
        });
      }
    }, 1000);

    const prefetchTimer2 = setTimeout(() => {
      if (!prefetchedViews.has('mealPlan')) {
        import('../components/MealPlanFlow').then(() => {
          setPrefetchedViews(prev => new Set(prev).add('mealPlan'));
          console.log('[Prefetch] MealPlanFlow loaded in background');
        });
      }
    }, 2000);

    const prefetchTimer3 = setTimeout(() => {
      if (!prefetchedViews.has('bookings')) {
        import('../components/BookingsView').then(() => {
          setPrefetchedViews(prev => new Set(prev).add('bookings'));
          console.log('[Prefetch] BookingsView loaded in background');
        });
      }
    }, 3000);

    const prefetchTimer4 = setTimeout(() => {
      if (!prefetchedViews.has('orders')) {
        import('../components/OrdersView').then(() => {
          setPrefetchedViews(prev => new Set(prev).add('orders'));
          console.log('[Prefetch] OrdersView loaded in background');
        });
      }
    }, 4000);

    return () => {
      clearTimeout(prefetchTimer);
      clearTimeout(prefetchTimer2);
      clearTimeout(prefetchTimer3);
      clearTimeout(prefetchTimer4);
    };
  }, [prefetchedViews]);

  if (currentView === 'booking') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <BookingFlow
          onComplete={() => setCurrentView('home')}
          onCancel={() => setCurrentView('home')}
        />
      </Suspense>
    );
  }

  if (currentView === 'mealPlan') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <MealPlanFlow
          onComplete={() => setCurrentView('home')}
          onCancel={() => setCurrentView('home')}
        />
      </Suspense>
    );
  }

  if (currentView === 'bookings') {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentView('home')}>
            ← Back to Home
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        <Suspense fallback={<LoadingFallback />}>
          <BookingsView />
        </Suspense>
      </div>
    );
  }

  if (currentView === 'orders') {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setCurrentView('home')}>
            ← Back to Home
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <Suspense fallback={<LoadingFallback />}>
          <OrdersView />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to Fresh</h1>
        <p className="text-xl text-muted-foreground">Your daily home-cooked meal service</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-fresh-600" />
              Today's Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fresh-600">{todayBookings.length}</div>
            <p className="text-sm text-muted-foreground">Active dabba pickups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-fresh-600" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fresh-600">{activeOrders.length}</div>
            <p className="text-sm text-muted-foreground">Meals in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-fresh-600" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-fresh-600">{orders.length}</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('booking')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-fresh-600" />
              Book Dabba Pickup
            </CardTitle>
            <CardDescription>Schedule daily pickup from home to office</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('mealPlan')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6 text-fresh-600" />
              Order Meals
            </CardTitle>
            <CardDescription>Browse and subscribe to meal plans</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Browse Meals
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest dabba pickups</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bookings yet</p>
            ) : (
              <div className="space-y-2">
                {bookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{booking.pickupAddress}</span>
                    <span className="text-xs text-muted-foreground capitalize">{booking.status}</span>
                  </div>
                ))}
                <Button variant="link" onClick={() => setCurrentView('bookings')} className="w-full">
                  View All Bookings
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest meal orders</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-2">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Order #{order.id.slice(0, 8)}</span>
                    <span className="text-xs text-muted-foreground capitalize">{order.status}</span>
                  </div>
                ))}
                <Button variant="link" onClick={() => setCurrentView('orders')} className="w-full">
                  View All Orders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
