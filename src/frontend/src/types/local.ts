// Local type definitions for types not exported by the backend
// These are used by the frontend but not available in the backend interface

import type { Principal } from "@icp-sdk/core/principal";

export interface UserProfile {
  name: string;
  userType: string; // "customer", "restaurant", "delivery", "admin"
}

export interface Meal {
  id: string;
  restaurantId: Principal;
  name: string;
  description: string;
  price: bigint;
  available: boolean;
  portionLimit: bigint;
  image?: any;
}

export interface Order {
  id: string;
  customerId: Principal;
  restaurantId: Principal;
  mealId: string;
  quantity: bigint;
  totalPrice: bigint;
  status: OrderStatusEnum;
  deliveryPartnerId?: Principal;
  deliveryStatus: DeliveryStatusEnum;
  subscriptionType: SubscriptionTypeEnum;
  scheduledDate?: bigint;
}

export interface CustomerProfile {
  id: Principal;
  name: string;
  address: string;
  walletBalance: bigint;
}

export interface RestaurantProfile {
  id: Principal;
  name: string;
  description: string;
  operatingHours: string;
  active: boolean;
}

export interface DeliveryPartner {
  id: Principal;
  name: string;
  available: boolean;
  totalEarnings: bigint;
  deliveryCount: bigint;
}

export interface Review {
  id: string;
  customerId: Principal;
  mealId: string;
  rating: bigint;
  comment: string;
}

export interface DabbaBooking {
  id: string;
  customerId: Principal;
  customerIdentifier?: string; // phone/email for OTP users
  pickupAddress: string;
  dropAddress: string;
  slotTime: PickupSlotEnum;
  frequency: SubscriptionTypeEnum;
  status: DabbaStatusEnum;
  deliveryPartnerId?: Principal;
}

export enum OrderStatusEnum {
  pending = "pending",
  confirmed = "confirmed",
  preparing = "preparing",
  readyForPickup = "readyForPickup",
  inTransit = "inTransit",
  delivered = "delivered",
  cancelled = "cancelled",
}

export enum DeliveryStatusEnum {
  pending = "pending",
  assigned = "assigned",
  pickedUp = "pickedUp",
  inTransit = "inTransit",
  delivered = "delivered",
  cancelled = "cancelled",
}

export enum SubscriptionTypeEnum {
  none = "none",
  daily = "daily",
  weekly = "weekly",
}

export enum PickupSlotEnum {
  morning = "morning",
  midMorning = "midMorning",
}

export enum DabbaStatusEnum {
  pending = "pending",
  pickedUp = "pickedUp",
  inTransit = "inTransit",
  delivered = "delivered",
  cancelled = "cancelled",
}
