import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import type { Email, PhoneNumber, OtpCode } from '../backend';
import type {
  UserProfile,
  Meal,
  Order,
  CustomerProfile,
  Review,
  DabbaBooking,
  SubscriptionTypeEnum,
  PickupSlotEnum,
  DeliveryPartner,
  RestaurantProfile,
  DeliveryStatusEnum,
  DabbaStatusEnum,
  OrderStatusEnum,
} from '../types/local';

// User profile functions with proper backend integration
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Check backend first
      const backendProfile = await actor.getCallerUserProfile();
      if (backendProfile) {
        return backendProfile;
      }
      // Fallback to localStorage for mock data
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 0, // Always refetch to get latest profile state
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      // Save to backend
      await actor.saveCallerUserProfile(profile);
      // Also save to localStorage as backup
      localStorage.setItem('userProfile', JSON.stringify(profile));
    },
    onSuccess: () => {
      // Invalidate and refetch the profile immediately
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.refetchQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// OTP Authentication Hooks
export function useSendEmailOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: Email) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendEmailOtp(email);
    },
  });
}

export function useSendPhoneOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (phone: PhoneNumber) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendPhoneOtp(phone);
    },
  });
}

export function useVerifyEmailOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ email, otp }: { email: Email; otp: OtpCode }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyEmailOtp(email, otp);
    },
  });
}

export function useVerifyPhoneOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ phone, otp }: { phone: PhoneNumber; otp: OtpCode }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyPhoneOtp(phone, otp);
    },
  });
}

export function useLinkEmailToProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: Email) => {
      if (!actor) throw new Error('Actor not available');
      return actor.linkEmailToProfile(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useLinkPhoneToProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phone: PhoneNumber) => {
      if (!actor) throw new Error('Actor not available');
      return actor.linkPhoneToProfile(phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Twilio Configuration Hooks
export function useIsTwilioConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['twilioConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isTwilioConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetTwilioConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: { accountSid: string; authToken: string; fromNumber: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setTwilioConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twilioConfigured'] });
    },
  });
}

// Mock implementations for features not yet in backend
// These return empty data or mock data for UI development

export function useCreateCustomerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, address }: { name: string; address: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't have createCustomerProfile yet, use localStorage
      localStorage.setItem('customerProfile', JSON.stringify({ name, address }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
      queryClient.refetchQueries({ queryKey: ['customerProfile'] });
    },
  });
}

export function useGetCustomerProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<CustomerProfile | null>({
    queryKey: ['customerProfile'],
    queryFn: async () => {
      if (!actor) return null;
      
      // Backend doesn't have getCustomerProfile yet, use localStorage
      const stored = localStorage.getItem('customerProfile');
      if (stored) {
        const data = JSON.parse(stored);
        return {
          id: Principal.fromText('2vxsx-fae'),
          name: data.name,
          address: data.address,
          walletBalance: BigInt(0),
        };
      }
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRestaurantProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, operatingHours }: { name: string; description: string; operatingHours: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't have createRestaurantProfile yet, use localStorage
      localStorage.setItem('restaurantProfile', JSON.stringify({ name, description, operatingHours }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurantProfile'] });
      queryClient.refetchQueries({ queryKey: ['restaurantProfile'] });
    },
  });
}

export function useGetRestaurantProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<RestaurantProfile | null>({
    queryKey: ['restaurantProfile'],
    queryFn: async () => {
      if (!actor) return null;
      
      // Backend doesn't have getRestaurantProfile yet, use localStorage
      const stored = localStorage.getItem('restaurantProfile');
      if (stored) {
        const data = JSON.parse(stored);
        return {
          id: Principal.fromText('2vxsx-fae'),
          name: data.name,
          description: data.description,
          operatingHours: data.operatingHours,
          active: true,
        };
      }
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateDeliveryProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't have createDeliveryProfile yet, use localStorage
      localStorage.setItem('deliveryProfile', JSON.stringify({ name }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryProfile'] });
      queryClient.refetchQueries({ queryKey: ['deliveryProfile'] });
    },
  });
}

export function useGetDeliveryProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<DeliveryPartner | null>({
    queryKey: ['deliveryProfile'],
    queryFn: async () => {
      if (!actor) return null;
      
      // Backend doesn't have getDeliveryProfile yet, use localStorage
      const stored = localStorage.getItem('deliveryProfile');
      if (stored) {
        const data = JSON.parse(stored);
        return {
          id: Principal.fromText('2vxsx-fae'),
          name: data.name,
          available: true,
          totalEarnings: BigInt(0),
          deliveryCount: BigInt(0),
        };
      }
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMeals() {
  const { actor, isFetching } = useActor();

  return useQuery<Meal[]>({
    queryKey: ['meals'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRestaurantMeals() {
  return useGetMeals();
}

export function useCreateMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: Meal) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have createMeal yet, mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useAddMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      price,
      portionLimit,
      image,
    }: {
      name: string;
      description: string;
      price: bigint;
      portionLimit: bigint;
      image: any | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useUpdateMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId,
      meal,
    }: {
      mealId: string;
      meal: Meal;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend doesn't have updateMeal yet, mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useDeleteMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId,
      quantity,
      subscriptionType,
      scheduledDate,
    }: {
      mealId: string;
      quantity: bigint;
      subscriptionType: SubscriptionTypeEnum;
      scheduledDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] });
    },
  });
}

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomerOrders() {
  return useGetMyOrders();
}

export function useGetRestaurantOrders() {
  return useGetMyOrders();
}

export function useGetDeliveryPartnerOrders() {
  return useGetMyOrders();
}

export function useGetAssignedOrders() {
  return useGetMyOrders();
}

export function useGetMyDabbaBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<DabbaBooking[]>({
    queryKey: ['myDabbaBookings'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDabbaBookings() {
  return useGetMyDabbaBookings();
}

export function useGetDeliveryPartnerDabbaBookings() {
  return useGetMyDabbaBookings();
}

export function useGetAssignedDabbaBookings() {
  return useGetMyDabbaBookings();
}

export function useCreateDabbaBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pickupAddress,
      dropAddress,
      slotTime,
      frequency,
    }: {
      pickupAddress: string;
      dropAddress: string;
      slotTime: PickupSlotEnum;
      frequency: SubscriptionTypeEnum;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDabbaBookings'] });
    },
  });
}

export function useUpdateDabbaBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      pickupAddress,
      dropAddress,
      slotTime,
      frequency,
    }: {
      bookingId: string;
      pickupAddress: string;
      dropAddress: string;
      slotTime: PickupSlotEnum;
      frequency: SubscriptionTypeEnum;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDabbaBookings'] });
    },
  });
}

export function useUpdateDabbaBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: DabbaStatusEnum }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDabbaBookings'] });
    },
  });
}

export function useCancelDabbaBookingByCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDabbaBookings'] });
    },
  });
}

export function useUpdateDabbaStatus() {
  return useUpdateDabbaBookingStatus();
}

export function useCreateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId,
      rating,
      comment,
    }: {
      mealId: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useGetReviewsForMeal(mealId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', mealId],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching && !!mealId,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['allOrders'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRestaurants() {
  const { actor, isFetching } = useActor();

  return useQuery<RestaurantProfile[]>({
    queryKey: ['allRestaurants'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllRestaurantProfiles() {
  return useGetAllRestaurants();
}

export function useGetAllDeliveryPartners() {
  const { actor, isFetching } = useActor();

  return useQuery<DeliveryPartner[]>({
    queryKey: ['allDeliveryPartners'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<CustomerProfile[]>({
    queryKey: ['allCustomers'],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateDeliveryAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (available: boolean) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryProfile'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatusEnum }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}

export function useUpdateDeliveryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: DeliveryStatusEnum }) => {
      if (!actor) throw new Error('Actor not available');
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });
}
