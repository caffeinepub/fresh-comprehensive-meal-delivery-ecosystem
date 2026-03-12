import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DabbaBooking as BackendDabbaBooking,
  Email,
  OtpCode,
  PhoneNumber,
} from "../backend";
import type {
  CustomerProfile,
  DabbaBooking,
  DeliveryPartner,
  DeliveryStatusEnum,
  Meal,
  Order,
  OrderStatusEnum,
  PickupSlotEnum,
  RestaurantProfile,
  Review,
  SubscriptionTypeEnum,
  UserProfile,
} from "../types/local";
import { DabbaStatusEnum } from "../types/local";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// User profile functions with proper backend integration
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      // Check backend first, fall through to localStorage on error
      try {
        const backendProfile = await actor.getCallerUserProfile();
        if (backendProfile) {
          // Cache to localStorage as backup
          localStorage.setItem("userProfile", JSON.stringify(backendProfile));
          return backendProfile;
        }
      } catch (e) {
        // Backend auth not available (OTP users) — fall through to localStorage
        console.log(
          "Backend profile fetch failed, using localStorage fallback",
          e,
        );
      }
      // Fallback to localStorage
      const stored = localStorage.getItem("userProfile");
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
      if (!actor) throw new Error("Actor not available");
      // Always save to localStorage immediately so UI never gets stuck
      localStorage.setItem("userProfile", JSON.stringify(profile));
      // Try backend, but don't fail if it errors (OTP users)
      try {
        await actor.saveCallerUserProfile(profile);
      } catch (e) {
        // Backend auth not available for OTP users — data saved locally
        console.log("Profile saved locally (backend auth not available)", e);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the profile immediately
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      queryClient.refetchQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// OTP Authentication Hooks
export function useSendEmailOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (email: Email) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendEmailOtp(email);
    },
  });
}

export function useSendPhoneOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (phone: PhoneNumber) => {
      if (!actor) throw new Error("Actor not available");
      return actor.sendPhoneOtp(phone);
    },
  });
}

export function useVerifyEmailOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ email, otp }: { email: Email; otp: OtpCode }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.verifyEmailOtp(email, otp);
    },
  });
}

export function useVerifyPhoneOtp() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      phone,
      otp,
    }: { phone: PhoneNumber; otp: OtpCode }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.verifyPhoneOtp(phone, otp);
    },
  });
}

export function useLinkEmailToProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: Email) => {
      if (!actor) throw new Error("Actor not available");
      return actor.linkEmailToProfile(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useLinkPhoneToProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (phone: PhoneNumber) => {
      if (!actor) throw new Error("Actor not available");
      return actor.linkPhoneToProfile(phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Twilio Configuration Hooks
export function useIsTwilioConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["twilioConfigured"],
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
    mutationFn: async (config: {
      accountSid: string;
      authToken: string;
      fromNumber: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setTwilioConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["twilioConfigured"] });
    },
  });
}

// Mock implementations for features not yet in backend
// These return empty data or mock data for UI development

export function useCreateCustomerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      address,
    }: { name: string; address: string }) => {
      if (!actor) throw new Error("Actor not available");

      // Backend doesn't have createCustomerProfile yet, use localStorage
      localStorage.setItem(
        "customerProfile",
        JSON.stringify({ name, address }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
      queryClient.refetchQueries({ queryKey: ["customerProfile"] });
    },
  });
}

export function useGetCustomerProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<CustomerProfile | null>({
    queryKey: ["customerProfile"],
    queryFn: async () => {
      if (!actor) return null;

      // Backend doesn't have getCustomerProfile yet, use localStorage
      const stored = localStorage.getItem("customerProfile");
      if (stored) {
        const data = JSON.parse(stored);
        return {
          id: Principal.fromText("2vxsx-fae"),
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
    mutationFn: async ({
      name,
      description,
      operatingHours,
    }: { name: string; description: string; operatingHours: string }) => {
      if (!actor) throw new Error("Actor not available");

      // Backend doesn't have createRestaurantProfile yet, use localStorage
      localStorage.setItem(
        "restaurantProfile",
        JSON.stringify({ name, description, operatingHours }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurantProfile"] });
      queryClient.refetchQueries({ queryKey: ["restaurantProfile"] });
    },
  });
}

export function useGetRestaurantProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<RestaurantProfile | null>({
    queryKey: ["restaurantProfile"],
    queryFn: async () => {
      if (!actor) return null;

      // Backend doesn't have getRestaurantProfile yet, use localStorage
      const stored = localStorage.getItem("restaurantProfile");
      if (stored) {
        const data = JSON.parse(stored);
        return {
          id: Principal.fromText("2vxsx-fae"),
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
      if (!actor) throw new Error("Actor not available");

      // Backend doesn't have createDeliveryProfile yet, use localStorage
      localStorage.setItem("deliveryProfile", JSON.stringify({ name }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryProfile"] });
      queryClient.refetchQueries({ queryKey: ["deliveryProfile"] });
    },
  });
}

export function useGetDeliveryProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<DeliveryPartner | null>({
    queryKey: ["deliveryProfile"],
    queryFn: async () => {
      if (!actor) return null;

      // Backend doesn't have getDeliveryProfile yet, use localStorage
      const stored = localStorage.getItem("deliveryProfile");
      if (stored) {
        const data = JSON.parse(stored);
        return {
          id: Principal.fromText("2vxsx-fae"),
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
    queryKey: ["meals"],
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
    mutationFn: async (_meal: Meal) => {
      if (!actor) throw new Error("Actor not available");
      // Backend doesn't have createMeal yet, mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });
}

export function useAddMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name: _name,
      description: _description,
      price: _price,
      portionLimit: _portionLimit,
      image: _image,
    }: {
      name: string;
      description: string;
      price: bigint;
      portionLimit: bigint;
      image: any | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });
}

export function useUpdateMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId: _mealId,
      meal: _meal,
    }: {
      mealId: string;
      meal: Meal;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // Backend doesn't have updateMeal yet, mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });
}

export function useDeleteMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_mealId: string) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_order: Order) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId: _mealId,
      quantity: _quantity,
      subscriptionType: _subscriptionType,
      scheduledDate: _scheduledDate,
    }: {
      mealId: string;
      quantity: bigint;
      subscriptionType: SubscriptionTypeEnum;
      scheduledDate: bigint | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    },
  });
}

export function useGetMyOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ["myOrders"],
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

// Helper function to convert frontend DabbaBooking to backend format
function toBackendDabbaBooking(booking: DabbaBooking): BackendDabbaBooking {
  return {
    id: booking.id,
    customerId: booking.customerId,
    pickupAddress: booking.pickupAddress,
    dropAddress: booking.dropAddress,
    slotTime: booking.slotTime,
    frequency: booking.frequency,
    status: booking.status,
    deliveryPartnerId: booking.deliveryPartnerId,
  };
}

// Helper function to convert backend DabbaBooking to frontend format
function _fromBackendDabbaBooking(booking: BackendDabbaBooking): DabbaBooking {
  return {
    id: booking.id,
    customerId: booking.customerId,
    pickupAddress: booking.pickupAddress,
    dropAddress: booking.dropAddress,
    slotTime: booking.slotTime,
    frequency: booking.frequency,
    status: booking.status,
    deliveryPartnerId: booking.deliveryPartnerId,
  };
}

export function useGetMyDabbaBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<DabbaBooking[]>({
    queryKey: ["customerBookings"],
    queryFn: async () => {
      if (!actor) return [];

      // Try to get from localStorage for now (mock data)
      const stored = localStorage.getItem("dabbaBookings");
      if (stored) {
        return JSON.parse(stored);
      }
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
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DabbaBooking[]>({
    queryKey: ["assignedBookings", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];

      try {
        const deliveryPartnerId = identity.getPrincipal().toString();
        const bookingIds = await actor.getAssignedBookings(deliveryPartnerId);

        // Get full booking details from localStorage
        const stored = localStorage.getItem("dabbaBookings");
        if (stored) {
          const allBookings: DabbaBooking[] = JSON.parse(stored);
          return allBookings.filter((b) => bookingIds.includes(b.id));
        }
        return [];
      } catch (error) {
        console.error("Error fetching assigned bookings:", error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
}

export function useCreateDabbaBooking() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
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
      if (!actor || !identity) throw new Error("Actor not available");

      // Create new booking
      const newBooking: DabbaBooking = {
        id: `booking-${Date.now()}`,
        customerId: identity.getPrincipal(),
        pickupAddress,
        dropAddress,
        slotTime,
        frequency,
        status: DabbaStatusEnum.pending,
        deliveryPartnerId: undefined,
      };

      // Save to backend
      await actor.updateBooking(toBackendDabbaBooking(newBooking));

      // Also save to localStorage
      const stored = localStorage.getItem("dabbaBookings");
      const bookings: DabbaBooking[] = stored ? JSON.parse(stored) : [];
      bookings.push(newBooking);
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));

      return newBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
    },
  });
}

export function useUpdateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: DabbaBooking) => {
      if (!actor) throw new Error("Actor not available");

      // Update in backend
      await actor.updateBooking(toBackendDabbaBooking(booking));

      // Also update localStorage
      const stored = localStorage.getItem("dabbaBookings");
      if (stored) {
        const bookings: DabbaBooking[] = JSON.parse(stored);
        const index = bookings.findIndex((b) => b.id === booking.id);
        if (index !== -1) {
          bookings[index] = booking;
          localStorage.setItem("dabbaBookings", JSON.stringify(bookings));
        }
      }

      return booking;
    },
    onSuccess: () => {
      // Invalidate all booking-related queries
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
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
      if (!actor) throw new Error("Actor not available");

      // Get existing booking
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");

      const bookings: DabbaBooking[] = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      // Update booking
      const updatedBooking: DabbaBooking = {
        ...booking,
        pickupAddress,
        dropAddress,
        slotTime,
        frequency,
      };

      // Save to backend
      await actor.updateBooking(toBackendDabbaBooking(updatedBooking));

      // Update localStorage
      const index = bookings.findIndex((b) => b.id === bookingId);
      bookings[index] = updatedBooking;
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));

      return updatedBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
    },
  });
}

export function useUpdateDabbaBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: { bookingId: string; status: DabbaStatusEnum }) => {
      if (!actor) throw new Error("Actor not available");

      // Get existing booking
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");

      const bookings: DabbaBooking[] = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      // Update status
      const updatedBooking: DabbaBooking = {
        ...booking,
        status,
      };

      // Save to backend
      await actor.updateBooking(toBackendDabbaBooking(updatedBooking));

      // Update localStorage
      const index = bookings.findIndex((b) => b.id === bookingId);
      bookings[index] = updatedBooking;
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));

      return updatedBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
    },
  });
}

export function useCancelDabbaBookingByCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error("Actor not available");

      // Get existing booking
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");

      const bookings: DabbaBooking[] = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");

      // Update status to cancelled
      const updatedBooking: DabbaBooking = {
        ...booking,
        status: DabbaStatusEnum.cancelled,
      };

      // Save to backend
      await actor.updateBooking(toBackendDabbaBooking(updatedBooking));

      // Update localStorage
      const index = bookings.findIndex((b) => b.id === bookingId);
      bookings[index] = updatedBooking;
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));

      return updatedBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
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
    mutationFn: async (_review: Review) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mealId: _mealId,
      rating: _rating,
      comment: _comment,
    }: {
      mealId: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useGetReviewsForMeal(mealId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ["reviews", mealId],
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
    queryKey: ["allOrders"],
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
    queryKey: ["allCustomers"],
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
    queryKey: ["allRestaurants"],
    queryFn: async () => {
      if (!actor) return [];
      // Mock implementation
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllDeliveryPartners() {
  const { actor, isFetching } = useActor();

  return useQuery<DeliveryPartner[]>({
    queryKey: ["allDeliveryPartners"],
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
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      const stored = localStorage.getItem("deliveryProfile");
      if (stored) {
        const profile = JSON.parse(stored);
        profile.available = available;
        localStorage.setItem("deliveryProfile", JSON.stringify(profile));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveryProfile"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId: _orderId,
      status: _status,
    }: { orderId: string; status: OrderStatusEnum }) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useUpdateDeliveryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId: _orderId2,
      status: _status2,
    }: { orderId: string; status: DeliveryStatusEnum }) => {
      if (!actor) throw new Error("Actor not available");
      // Mock implementation
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}
