import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type OtpCode = string;
export type Email = string;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type OtpStatus = {
    __kind__: "verified";
    verified: null;
} | {
    __kind__: "expired";
    expired: null;
} | {
    __kind__: "alreadyVerified";
    alreadyVerified: null;
} | {
    __kind__: "invalidPhoneNumber";
    invalidPhoneNumber: null;
} | {
    __kind__: "invalid";
    invalid: null;
} | {
    __kind__: "twilioMissing";
    twilioMissing: null;
} | {
    __kind__: "notFound";
    notFound: null;
} | {
    __kind__: "delivered";
    delivered: null;
} | {
    __kind__: "twilioResponse";
    twilioResponse: string;
} | {
    __kind__: "twilioError";
    twilioError: string;
} | {
    __kind__: "smsFailed";
    smsFailed: string;
};
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type PhoneNumber = string;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface DabbaBooking {
    id: string;
    status: DabbaStatusEnum;
    pickupAddress: string;
    slotTime: PickupSlotEnum;
    customerId: Principal;
    frequency: SubscriptionTypeEnum;
    dropAddress: string;
    deliveryPartnerId?: Principal;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface TwilioConfiguration {
    accountSid: string;
    authToken: string;
    fromNumber: string;
}
export interface UserProfile {
    userType: string;
    name: string;
}
export enum DabbaStatusEnum {
    cancelled = "cancelled",
    pending = "pending",
    inTransit = "inTransit",
    pickedUp = "pickedUp",
    delivered = "delivered"
}
export enum PickupSlotEnum {
    morning = "morning",
    midMorning = "midMorning"
}
export enum SubscriptionTypeEnum {
    none = "none",
    daily = "daily",
    weekly = "weekly"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getAssignedBookings(deliveryPartnerId: string): Promise<Array<string>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    isTwilioConfigured(): Promise<boolean>;
    linkEmailToProfile(email: Email): Promise<void>;
    linkPhoneToProfile(phone: PhoneNumber): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendEmailOtp(email: Email): Promise<OtpStatus>;
    sendPhoneOtp(phone: PhoneNumber): Promise<OtpStatus>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    setTwilioConfiguration(config: TwilioConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    twilioTransform(input: TransformationInput): Promise<TransformationOutput>;
    updateBooking(booking: DabbaBooking): Promise<void>;
    verifyEmailOtp(email: Email, otp: OtpCode): Promise<OtpStatus>;
    verifyPhoneOtp(phone: PhoneNumber, otp: OtpCode): Promise<OtpStatus>;
}
