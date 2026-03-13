var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentResult, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn, _a;
import { y as Subscribable, z as shallowEqualObjects, A as hashKey, F as getDefaultState, G as notifyManager, p as useQueryClient, r as reactExports, H as noop, I as shouldThrowError, u as useInternetIdentity, J as Principal } from "./index-BfIGtKmp.js";
import { u as useActor, a as useQuery } from "./useActor-ClP9Ae-Z.js";
var MutationObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client).getMutationCache().build(__privateGet(this, _client), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client = new WeakMap(), _currentResult = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn = function(action) {
  notifyManager.batch(() => {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult).variables;
      const onMutateResult = __privateGet(this, _currentResult).context;
      const context = {
        client: __privateGet(this, _client),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        (_b = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b.call(
          _a2,
          action.data,
          variables,
          onMutateResult,
          context
        );
        (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
          _c,
          action.data,
          null,
          variables,
          onMutateResult,
          context
        );
      } else if ((action == null ? void 0 : action.type) === "error") {
        (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
          _e,
          action.error,
          variables,
          onMutateResult,
          context
        );
        (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
          _g,
          void 0,
          action.error,
          variables,
          onMutateResult,
          context
        );
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult));
    });
  });
}, _a);
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
var OrderStatusEnum = /* @__PURE__ */ ((OrderStatusEnum2) => {
  OrderStatusEnum2["pending"] = "pending";
  OrderStatusEnum2["confirmed"] = "confirmed";
  OrderStatusEnum2["preparing"] = "preparing";
  OrderStatusEnum2["readyForPickup"] = "readyForPickup";
  OrderStatusEnum2["inTransit"] = "inTransit";
  OrderStatusEnum2["delivered"] = "delivered";
  OrderStatusEnum2["cancelled"] = "cancelled";
  return OrderStatusEnum2;
})(OrderStatusEnum || {});
var DeliveryStatusEnum = /* @__PURE__ */ ((DeliveryStatusEnum2) => {
  DeliveryStatusEnum2["pending"] = "pending";
  DeliveryStatusEnum2["assigned"] = "assigned";
  DeliveryStatusEnum2["pickedUp"] = "pickedUp";
  DeliveryStatusEnum2["inTransit"] = "inTransit";
  DeliveryStatusEnum2["delivered"] = "delivered";
  DeliveryStatusEnum2["cancelled"] = "cancelled";
  return DeliveryStatusEnum2;
})(DeliveryStatusEnum || {});
var SubscriptionTypeEnum = /* @__PURE__ */ ((SubscriptionTypeEnum2) => {
  SubscriptionTypeEnum2["none"] = "none";
  SubscriptionTypeEnum2["daily"] = "daily";
  SubscriptionTypeEnum2["weekly"] = "weekly";
  return SubscriptionTypeEnum2;
})(SubscriptionTypeEnum || {});
var PickupSlotEnum = /* @__PURE__ */ ((PickupSlotEnum2) => {
  PickupSlotEnum2["morning"] = "morning";
  PickupSlotEnum2["midMorning"] = "midMorning";
  return PickupSlotEnum2;
})(PickupSlotEnum || {});
var DabbaStatusEnum = /* @__PURE__ */ ((DabbaStatusEnum2) => {
  DabbaStatusEnum2["pending"] = "pending";
  DabbaStatusEnum2["pickedUp"] = "pickedUp";
  DabbaStatusEnum2["inTransit"] = "inTransit";
  DabbaStatusEnum2["delivered"] = "delivered";
  DabbaStatusEnum2["cancelled"] = "cancelled";
  return DabbaStatusEnum2;
})(DabbaStatusEnum || {});
const BOOKING_POLL_INTERVAL = 3e4;
const ORDER_POLL_INTERVAL = 3e4;
function useGetRestaurantProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
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
          active: true
        };
      }
      return null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 12e4
  });
}
function useGetDeliveryProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
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
          deliveryCount: BigInt(0)
        };
      }
      return null;
    },
    enabled: !!actor && !isFetching,
    staleTime: 12e4
  });
}
function useGetMeals() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching
  });
}
function useGetRestaurantMeals() {
  return useGetMeals();
}
function useCreateMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_meal) => {
      if (!actor) throw new Error("Actor not available");
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    }
  });
}
function useUpdateMeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      mealId: _mealId,
      meal: _meal
    }) => {
      if (!actor) throw new Error("Actor not available");
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    }
  });
}
function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      mealId: _mealId,
      quantity: _quantity,
      subscriptionType: _subscriptionType,
      scheduledDate: _scheduledDate
    }) => {
      if (!actor) throw new Error("Actor not available");
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["customerProfile"] });
    }
  });
}
function useGetMyOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching
  });
}
function useGetCustomerOrders() {
  return useGetMyOrders();
}
function useGetRestaurantOrders() {
  return useGetMyOrders();
}
function useGetAssignedOrders() {
  return useGetMyOrders();
}
function toBackendDabbaBooking(booking) {
  return {
    id: booking.id,
    customerId: booking.customerId,
    pickupAddress: booking.pickupAddress,
    dropAddress: booking.dropAddress,
    slotTime: booking.slotTime,
    frequency: booking.frequency,
    status: booking.status,
    deliveryPartnerId: booking.deliveryPartnerId ? [booking.deliveryPartnerId] : []
  };
}
function fromBackendDabbaBooking(booking) {
  const rawPartner = booking.deliveryPartnerId;
  const deliveryPartnerId = Array.isArray(rawPartner) && rawPartner.length > 0 ? rawPartner[0] : !Array.isArray(rawPartner) && rawPartner != null ? rawPartner : void 0;
  return {
    id: booking.id,
    customerId: booking.customerId,
    pickupAddress: booking.pickupAddress,
    dropAddress: booking.dropAddress,
    slotTime: booking.slotTime,
    frequency: booking.frequency,
    status: booking.status,
    deliveryPartnerId
  };
}
function useGetMyDabbaBookings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["customerBookings", identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      const stored = localStorage.getItem("dabbaBookings");
      const localBookings = stored ? JSON.parse(stored) : [];
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
          const guestBookings = await actor.getGuestBookingsByIdentifier(guestId);
          const guestMapped = guestBookings.map((b) => ({
            id: b.id,
            customerId: Principal.anonymous(),
            pickupAddress: b.pickupAddress,
            dropAddress: b.dropAddress,
            slotTime: b.slotTime,
            frequency: b.frequency,
            status: b.status,
            deliveryPartnerId: b.deliveryPartnerId
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
    refetchInterval: BOOKING_POLL_INTERVAL
  });
}
function useGetDabbaBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allDabbaBookings"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const [backendBookings, guestBookingsRaw] = await Promise.all([
          actor.getAllBookings().catch(() => []),
          actor.getAllGuestBookings().catch(() => [])
        ]);
        const regular = backendBookings.map(fromBackendDabbaBooking);
        const guests = guestBookingsRaw.map(
          (b) => ({
            id: b.id,
            customerId: Principal.anonymous(),
            pickupAddress: b.pickupAddress,
            dropAddress: b.dropAddress,
            slotTime: b.slotTime,
            frequency: b.frequency,
            status: b.status,
            deliveryPartnerId: b.deliveryPartnerId,
            customerIdentifier: b.customerIdentifier
          })
        );
        return [...regular, ...guests];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: BOOKING_POLL_INTERVAL
  });
}
function useGetAssignedDabbaBookings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["assignedBookings", identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const allBookings = await actor.getAllBookings();
        const myPrincipal = identity == null ? void 0 : identity.getPrincipal().toString();
        return allBookings.map(fromBackendDabbaBooking).filter((b) => {
          var _a2;
          return ((_a2 = b.deliveryPartnerId) == null ? void 0 : _a2.toString()) === myPrincipal;
        });
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: BOOKING_POLL_INTERVAL
  });
}
function useCreateDabbaBooking() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pickupAddress,
      dropAddress,
      slotTime,
      frequency
    }) => {
      if (!actor) throw new Error("Actor not available");
      const isIIUser = !!identity && !identity.getPrincipal().isAnonymous();
      const customerId = isIIUser ? identity.getPrincipal() : Principal.anonymous();
      const newBooking = {
        id: `booking-${Date.now()}`,
        customerId,
        pickupAddress,
        dropAddress,
        slotTime,
        frequency,
        status: DabbaStatusEnum.pending,
        deliveryPartnerId: void 0
      };
      const stored = localStorage.getItem("dabbaBookings");
      const bookings = stored ? JSON.parse(stored) : [];
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
          deliveryPartnerId: newBooking.deliveryPartnerId ?? []
        };
        await actor.createGuestBooking(guestBooking);
      }
      return newBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allDabbaBookings"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    }
  });
}
function useUpdateBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (booking) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateBooking(toBackendDabbaBooking(booking));
      const stored = localStorage.getItem("dabbaBookings");
      if (stored) {
        const bookings = JSON.parse(stored);
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
    }
  });
}
function useUpdateDabbaBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      status
    }) => {
      if (!actor) throw new Error("Actor not available");
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");
      const bookings = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      const updatedBooking = { ...booking, status };
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
    }
  });
}
function useCancelDabbaBookingByCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId) => {
      if (!actor) throw new Error("Actor not available");
      const stored = localStorage.getItem("dabbaBookings");
      if (!stored) throw new Error("Booking not found");
      const bookings = JSON.parse(stored);
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) throw new Error("Booking not found");
      const updatedBooking = {
        ...booking,
        status: DabbaStatusEnum.cancelled
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
    }
  });
}
function useUpdateDabbaStatus() {
  return useUpdateDabbaBookingStatus();
}
function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      mealId: _mealId,
      rating: _rating,
      comment: _comment
    }) => {
      if (!actor) throw new Error("Actor not available");
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    }
  });
}
function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const [bookings, guestBookingsRaw] = await Promise.all([
          actor.getAllBookings().catch(() => []),
          actor.getAllGuestBookings().catch(() => [])
        ]);
        const regular = bookings.map((b) => ({
          id: b.id,
          customerId: b.customerId,
          restaurantId: b.customerId,
          mealId: "dabba",
          quantity: BigInt(1),
          totalPrice: BigInt(0),
          status: b.status,
          deliveryPartnerId: b.deliveryPartnerId,
          deliveryStatus: b.status,
          subscriptionType: "none",
          scheduledDate: void 0
        }));
        const guests = guestBookingsRaw.map((b) => ({
          id: b.id,
          customerId: b.customerIdentifier || "guest",
          restaurantId: b.customerIdentifier || "guest",
          mealId: "dabba",
          quantity: BigInt(1),
          totalPrice: BigInt(0),
          status: b.status,
          deliveryPartnerId: b.deliveryPartnerId,
          deliveryStatus: b.status,
          subscriptionType: "none",
          scheduledDate: void 0
        }));
        const regularIds = new Set(regular.map((o) => o.id));
        const uniqueGuests = guests.filter((g) => !regularIds.has(g.id));
        return [...regular, ...uniqueGuests];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: ORDER_POLL_INTERVAL
  });
}
function useGetAllCustomers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allCustomers"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching
  });
}
function useGetAllRestaurants() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allRestaurants"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching
  });
}
function useGetAllDeliveryPartners() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allDeliveryPartners"],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching
  });
}
function useUpdateDeliveryAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (available) => {
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
    }
  });
}
function useUpdateDeliveryStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId: _orderId2,
      status: _status2
    }) => {
      if (!actor) throw new Error("Actor not available");
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    }
  });
}
export {
  DabbaStatusEnum as D,
  OrderStatusEnum as O,
  PickupSlotEnum as P,
  SubscriptionTypeEnum as S,
  useGetAllRestaurants as a,
  useGetAllDeliveryPartners as b,
  useGetAllOrders as c,
  useGetDabbaBookings as d,
  useGetCustomerOrders as e,
  useGetDeliveryProfile as f,
  useGetAssignedOrders as g,
  useGetAssignedDabbaBookings as h,
  useUpdateDeliveryAvailability as i,
  useUpdateDeliveryStatus as j,
  useUpdateDabbaStatus as k,
  DeliveryStatusEnum as l,
  useGetRestaurantProfile as m,
  useGetRestaurantMeals as n,
  useGetRestaurantOrders as o,
  useCreateMeal as p,
  useUpdateMeal as q,
  useCreateDabbaBooking as r,
  useGetMeals as s,
  usePlaceOrder as t,
  useGetAllCustomers as u,
  useGetMyDabbaBookings as v,
  useCancelDabbaBookingByCustomer as w,
  useUpdateBooking as x,
  useSubmitReview as y
};
