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

// ─── Polling intervals ────────────────────────────────────────────────────────
// Reduced from 8–15s to 30s to dramatically reduce backend roundtrips
const BOOKING_POLL_INTERVAL = 30_000;
const ORDER_POLL_INTERVAL = 30_000;

// User profile functions with proper backend integration
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        const backendProfile = await actor.getCallerUserProfile();
        if (backendProfile) {
          localStorage.setItem("userProfile", JSON.stringify(backendProfile));
          return backendProfile;
        }
      } catch {
        // fall through to localStorage
      }
      const stored = localStorage.getItem("userProfile");
      if (stored) return JSON.parse(stored);
      return null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    staleTime: 120_000, // Profile changes rarely — cache for 2 minutes
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
      localStorage.setItem("userProfile", JSON.stringify(profile));
      try {
        await actor.saveCallerUserProfile(profile);
      } catch {
        // data saved locally only
      }
    },
    onSuccess: () => {
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
    staleTime: 300_000, // Config rarely changes — cache 5 min
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

export function useCreateCustomerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      address,
    }: { name: string; address: string }) => {
      if (!actor) throw new Error("Actor not available");
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
    staleTime: 120_000,
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
    staleTime: 120_000,
  });
}

export function useCreateDeliveryProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!actor) throw new Error("Actor not available");
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
    staleTime: 120_000,
  });
}

export function useGetMeals() {
  const { actor, isFetching } = useActor();
  return useQuery<Meal[]>({
    queryKey: ["meals"],
    queryFn: async () => {
      if (!actor) return [];
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
    }: { mealId: string; meal: Meal }) => {
      if (!actor) throw new Error("Actor not available");
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

// Helper: frontend DabbaBooking → backend format
function toBackendDabbaBooking(booking: DabbaBooking): BackendDabbaBooking {
  return {
    id: booking.id,
    customerId: booking.customerId,
    pickupAddress: booking.pickupAddress,
    dropAddress: booking.dropAddress,
    slotTime: booking.slotTime,
    frequency: booking.frequency,
    status: booking.status,
    deliveryPartnerId: booking.deliveryPartnerId
      ? ([booking.deliveryPartnerId] as any)
      : ([] as any),
  };
}

// Helper: backend DabbaBooking → frontend format
function fromBackendDabbaBooking(booking: BackendDabbaBooking): DabbaBooking {
  const rawPartner = booking.deliveryPartnerId as any;
  const deliveryPartnerId =
    Array.isArray(rawPartner) && rawPartner.length > 0
      ? rawPartner[0]
      : !Array.isArray(rawPartner) && rawPartner != null
        ? rawPartner
        : undefined;
  return {
    id: booking.id,
    customerId: booking.customerId,
    pickupAddress: booking.pickupAddress,
    dropAddress: booking.dropAddress,
    slotTime: booking.slotTime,
    frequency: booking.frequency,
    status: booking.status,
    deliveryPartnerId,
  };
}

export function useGetMyDabbaBookings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DabbaBooking[]>({
    queryKey: ["customerBookings", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];

      const stored = localStorage.getItem("dabbaBookings");
      const localBookings: DabbaBooking[] = stored ? JSON.parse(stored) : [];

      const isIIUser = !!identity && !identity.getPrincipal().isAnonymous();

      if (isIIUser) {
        try {
          const backendBookings = await actor.getCallerBookings();
          const backendMapped = backendBookings.map(fromBackendDabbaBooking);
          const backendIds = new Set(backendMapped.map((b) => b.id));
          const localOnly = localBookings.filter((b) => !backendIds.has(b.id));
          return [...backendMapped, ...localOnly];
        } catch {
          return localBookings;
        }
      }

      const guestId = localStorage.getItem("fresh_guest_id");
      if (guestId) {
        try {
          const guestBookings: any[] = await (
            actor as any
          ).getGuestBookingsByIdentifier(guestId);
          const guestMapped: DabbaBooking[] = guestBookings.map((b: any) => ({
            id: b.id,
            customerId: Principal.anonymous(),
            pickupAddress: b.pickupAddress,
            dropAddress: b.dropAddress,
            slotTime: b.slotTime,
            frequency: b.frequency,
            status: b.status,
            deliveryPartnerId: b.deliveryPartnerId,
          }));
          const backendIds = new Set(guestMapped.map((b) => b.id));
          const localOnly = localBookings.filter((b) => !backendIds.has(b.id));
          return [...guestMapped, ...localOnly];
        } catch {
          return localBookings;
        }
      }

      return localBookings;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: BOOKING_POLL_INTERVAL,
  });
}

export function useGetDabbaBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<DabbaBooking[]>({
    queryKey: ["allDabbaBookings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const [backendBookings, guestBookingsRaw] = await Promise.all([
          actor.getAllBookings().catch(() => []),
          (actor as any).getAllGuestBookings().catch(() => []),
        ]);
        const regular = (backendBookings as any[]).map(fromBackendDabbaBooking);
        const guests: DabbaBooking[] = (guestBookingsRaw as any[]).map(
          (b: any) => ({
            id: b.id,
            customerId: Principal.anonymous(),
            pickupAddress: b.pickupAddress,
            dropAddress: b.dropAddress,
            slotTime: b.slotTime,
            frequency: b.frequency,
            status: b.status,
            deliveryPartnerId: b.deliveryPartnerId,
            customerIdentifier: b.customerIdentifier,
          }),
        );
        return [...regular, ...guests];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: BOOKING_POLL_INTERVAL,
  });
}

export function useGetDeliveryPartnerDabbaBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<DabbaBooking[]>({
    queryKey: ["allDabbaBookings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const [backendBookings, guestBookingsRaw] = await Promise.all([
          actor.getAllBookings().catch(() => []),
          (actor as any).getAllGuestBookings().catch(() => []),
        ]);
        const regular = (backendBookings as any[]).map(fromBackendDabbaBooking);
        const guests: DabbaBooking[] = (guestBookingsRaw as any[]).map(
          (b: any) => ({
            id: b.id,
            customerId: Principal.anonymous(),
            pickupAddress: b.pickupAddress,
            dropAddress: b.dropAddress,
            slotTime: b.slotTime,
            frequency: b.frequency,
            status: b.status,
            deliveryPartnerId: b.deliveryPartnerId,
          }),
        );
        return [...regular, ...guests];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: BOOKING_POLL_INTERVAL,
  });
}

export function useGetAssignedDabbaBookings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DabbaBooking[]>({
    queryKey: ["assignedBookings", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const allBookings = await actor.getAllBookings();
        const myPrincipal = identity?.getPrincipal().toString();
        return allBookings
          .map(fromBackendDabbaBooking)
          .filter((b) => b.deliveryPartnerId?.toString() === myPrincipal);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: BOOKING_POLL_INTERVAL,
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
      if (!actor) throw new Error("Actor not available");

      const isIIUser = !!identity && !identity.getPrincipal().isAnonymous();
      const customerId = isIIUser
        ? identity!.getPrincipal()
        : Principal.anonymous();

      const newBooking: DabbaBooking = {
        id: `booking-${Date.now()}`,
        customerId,
        pickupAddress,
        dropAddress,
        slotTime,
        frequency,
        status: DabbaStatusEnum.pending,
        deliveryPartnerId: undefined,
      };

      const stored = localStorage.getItem("dabbaBookings");
      const bookings: DabbaBooking[] = stored ? JSON.parse(stored) : [];
      bookings.push(newBooking);
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));

      if (isIIUser) {
        await actor.updateBooking(toBackendDabbaBooking(newBooking));
      } else {
        let guestId = localStorage.getItem("fresh_guest_id");
        if (!guestId) {
          guestId = `guest-${Date.now()}`;
          localStorage.setItem("fresh_guest_id", guestId);
        }
        const guestBooking = {
          id: newBooking.id,
          customerIdentifier: guestId,
          pickupAddress: newBooking.pickupAddress,
          dropAddress: newBooking.dropAddress,
          slotTime: newBooking.slotTime,
          frequency: newBooking.frequency,
          status: newBooking.status,
          deliveryPartnerId: newBooking.deliveryPartnerId ?? [],
        };
        await (actor as any).createGuestBooking(guestBooking);
      }

      return newBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allDabbaBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useUpdateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: DabbaBooking) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateBooking(toBackendDabbaBooking(booking));
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
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allDabbaBookings"] });
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
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");
      const bookings: DabbaBooking[] = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      const updatedBooking: DabbaBooking = {
        ...booking,
        pickupAddress,
        dropAddress,
        slotTime,
        frequency,
      };
      await actor.updateBooking(toBackendDabbaBooking(updatedBooking));
      const index = bookings.findIndex((b) => b.id === bookingId);
      bookings[index] = updatedBooking;
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));
      return updatedBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allDabbaBookings"] });
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
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");
      const bookings: DabbaBooking[] = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      const updatedBooking: DabbaBooking = { ...booking, status };
      await actor.updateBooking(toBackendDabbaBooking(updatedBooking));
      const index = bookings.findIndex((b) => b.id === bookingId);
      bookings[index] = updatedBooking;
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));
      return updatedBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allDabbaBookings"] });
    },
  });
}

export function useCancelDabbaBookingByCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error("Actor not available");
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");
      const bookings: DabbaBooking[] = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      const updatedBooking: DabbaBooking = {
        ...booking,
        status: DabbaStatusEnum.cancelled,
      };
      await actor.updateBooking(toBackendDabbaBooking(updatedBooking));
      const index = bookings.findIndex((b) => b.id === bookingId);
      bookings[index] = updatedBooking;
      localStorage.setItem("dabbaBookings", JSON.stringify(bookings));
      return updatedBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["assignedBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allDabbaBookings"] });
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
    }: { mealId: string; rating: bigint; comment: string }) => {
      if (!actor) throw new Error("Actor not available");
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
      try {
        const [bookings, guestBookingsRaw] = await Promise.all([
          actor.getAllBookings().catch(() => []),
          (actor as any).getAllGuestBookings().catch(() => []),
        ]);
        const regular = (bookings as any[]).map((b) => ({
          id: b.id,
          customerId: b.customerId,
          restaurantId: b.customerId,
          mealId: "dabba",
          quantity: BigInt(1),
          totalPrice: BigInt(0),
          status: b.status as any,
          deliveryPartnerId: b.deliveryPartnerId,
          deliveryStatus: b.status as any,
          subscriptionType: "none" as any,
          scheduledDate: undefined,
        }));
        const guests = (guestBookingsRaw as any[]).map((b: any) => ({
          id: b.id,
          customerId: b.customerIdentifier || "guest",
          restaurantId: b.customerIdentifier || "guest",
          mealId: "dabba",
          quantity: BigInt(1),
          totalPrice: BigInt(0),
          status: b.status as any,
          deliveryPartnerId: b.deliveryPartnerId,
          deliveryStatus: b.status as any,
          subscriptionType: "none" as any,
          scheduledDate: undefined,
        }));
        const regularIds = new Set(regular.map((o: any) => o.id));
        const uniqueGuests = guests.filter((g: any) => !regularIds.has(g.id));
        return [...regular, ...uniqueGuests];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: ORDER_POLL_INTERVAL,
  });
}

export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();
  return useQuery<CustomerProfile[]>({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      if (!actor) return [];
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
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}
