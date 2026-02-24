import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Migration "migration";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Email = Text;
  type PhoneNumber = Text;
  type OtpCode = Text;

  public type TwilioConfiguration = {
    accountSid : Text;
    authToken : Text;
    fromNumber : Text;
  };

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;
  let accessControlState = AccessControl.initState();
  var twilioConfiguration : ?TwilioConfiguration = null;

  // ------------ OTP Types ------------
  type OtpEntry = {
    code : OtpCode;
    timestamp : Int;
    verified : Bool;
  };

  public type OtpStatus = {
    #delivered;
    #expired;
    #verified;
    #invalid;
    #notFound;
    #alreadyVerified;
    #smsFailed : Text;
    #twilioMissing;
    #twilioError : Text;
    #twilioResponse : Text;
    #invalidPhoneNumber;
  };

  let emailOtpStore = Map.empty<Email, OtpEntry>();
  let phoneOtpStore = Map.empty<PhoneNumber, OtpEntry>();

  // ------------ Enums ------------
  module MarketplaceCategoryEnum {
    public type MarketplaceCategoryEnum = {
      #food;
    };
  };

  module OrderStatusEnum {
    public type OrderStatusEnum = {
      #pending;
      #confirmed;
      #preparing;
      #readyForPickup;
      #inTransit;
      #delivered;
      #cancelled;
    };
  };

  module DeliveryStatusEnum {
    public type DeliveryStatusEnum = {
      #pending;
      #assigned;
      #pickedUp;
      #inTransit;
      #delivered;
      #cancelled;
    };
  };

  module SubscriptionTypeEnum {
    public type SubscriptionTypeEnum = {
      #none;
      #daily;
      #weekly;
    };
  };

  module PickupSlotEnum {
    public type PickupSlotEnum = {
      #morning;
      #midMorning;
    };
  };

  module DabbaStatusEnum {
    public type DabbaStatusEnum = {
      #pending;
      #pickedUp;
      #inTransit;
      #delivered;
      #cancelled;
    };
  };

  // ------------ Data Types ------------
  type Meal = {
    id : Text;
    restaurantId : Principal;
    name : Text;
    description : Text;
    price : Nat;
    available : Bool;
    portionLimit : Nat;
    image : ?Storage.ExternalBlob;
  };

  type Order = {
    id : Text;
    customerId : Principal;
    restaurantId : Principal;
    mealId : Text;
    quantity : Nat;
    totalPrice : Nat;
    status : OrderStatusEnum.OrderStatusEnum;
    deliveryPartnerId : ?Principal;
    deliveryStatus : DeliveryStatusEnum.DeliveryStatusEnum;
    subscriptionType : SubscriptionTypeEnum.SubscriptionTypeEnum;
    scheduledDate : ?Int;
  };

  type RestaurantProfile = {
    id : Principal;
    name : Text;
    description : Text;
    operatingHours : Text;
    active : Bool;
  };

  type DeliveryPartner = {
    id : Principal;
    name : Text;
    available : Bool;
    totalEarnings : Nat;
    deliveryCount : Nat;
  };

  type CustomerProfile = {
    id : Principal;
    name : Text;
    address : Text;
    walletBalance : Nat;
  };

  type Review = {
    id : Text;
    customerId : Principal;
    mealId : Text;
    rating : Nat;
    comment : Text;
  };

  public type UserProfile = {
    name : Text;
    userType : Text;
  };

  public type DabbaBooking = {
    id : Text;
    customerId : Principal;
    pickupAddress : Text;
    dropAddress : Text;
    slotTime : PickupSlotEnum.PickupSlotEnum;
    frequency : SubscriptionTypeEnum.SubscriptionTypeEnum;
    status : DabbaStatusEnum.DabbaStatusEnum;
    deliveryPartnerId : ?Principal;
  };

  let marketplaceCategoryProperties = Map.empty<Text, MarketplaceCategoryEnum.MarketplaceCategoryEnum>();
  let meals = Map.empty<Text, Meal>();
  let orders = Map.empty<Text, Order>();
  let restaurantProfiles = Map.empty<Principal, RestaurantProfile>();
  let deliveryPartners = Map.empty<Principal, DeliveryPartner>();
  let customerProfiles = Map.empty<Principal, CustomerProfile>();
  let reviews = Map.empty<Text, Review>();
  let dabbaBookings = Map.empty<Text, DabbaBooking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // ------------ OTP Functions ------------
  func generateOtpCode() : OtpCode {
    let timestamp = Time.now();
    let pseudoRandomNumber = timestamp % 900000 + 100000;
    Int.toText(pseudoRandomNumber);
  };

  func isOtpExpired(timestamp : Int) : Bool {
    let now = Time.now();
    now - timestamp > (5 * 60 * 1_000_000_000);
  };

  func isValidIndianPhoneNumber(phone : PhoneNumber) : Bool {
    let chars = phone.toArray();
    chars.size() == 13 and (
      chars[0] == '+' and chars[1] == '9' and chars[2] == '1'
    );
  };

  // ------------ Access Control Functions ------------
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
    marketplaceCategoryProperties.add("food", #food);

    let partnerList = [
      ("John Doe", "Vancouver - Downtown"),
      ("Emily Smith", "Vancouver - Kitsilano"),
      ("Michael Lee", "Vancouver - Burnaby"),
      ("Sophia Johnson", "Vancouver - Richmond"),
    ];

    for (partner in partnerList.vals()) {
      let (name, _area) = partner;
      let id = Principal.fromText("2vxsx-fae");
      let deliveryPartner : DeliveryPartner = {
        id;
        name;
        available = true;
        totalEarnings = 0;
        deliveryCount = 0;
      };
      deliveryPartners.add(id, deliveryPartner);
    };
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // ------------ OTP Functions (Guest Access Allowed) ------------
  public shared ({ caller }) func sendEmailOtp(email : Email) : async OtpStatus {
    let otp = generateOtpCode();
    let entry : OtpEntry = {
      code = otp;
      timestamp = Time.now();
      verified = false;
    };
    emailOtpStore.add(email, entry);
    #delivered;
  };

  public shared ({ caller }) func sendPhoneOtp(phone : PhoneNumber) : async OtpStatus {
    if (not isValidIndianPhoneNumber(phone)) {
      return #invalidPhoneNumber;
    };

    let otp = generateOtpCode();
    let entry : OtpEntry = {
      code = otp;
      timestamp = Time.now();
      verified = false;
    };

    switch (twilioConfiguration) {
      case (null) {
        phoneOtpStore.add(phone, entry);
        #twilioMissing;
      };
      case (?config) {
        phoneOtpStore.add(phone, entry);
        let twilioUrl = buildTwilioUrl(config.accountSid);
        let payload = buildTwilioPayload(config.fromNumber, phone, otp);
        let encodedAuth = encodeTwilioAuth(config.accountSid, config.authToken);

        let headers = [
          buildAuthorizationHeader(encodedAuth),
          {
            name = "Content-Type";
            value = "application/x-www-form-urlencoded";
          },
        ];

        let response = await OutCall.httpPostRequest(twilioUrl, headers, payload, twilioTransform);
        #twilioResponse(response);
      };
    };
  };

  public query func twilioTransform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func buildTwilioUrl(accountSid : Text) : Text {
    "https://api.twilio.com/2010-04-01/Accounts/" # accountSid # "/Messages.json";
  };

  func buildTwilioPayload(from : Text, to : Text, body : Text) : Text {
    "From=" # from # "&To=" # to # "&Body=" # body;
  };

  func encodeTwilioAuth(username : Text, password : Text) : Text {
    username # ":" # password;
  };

  func buildAuthorizationHeader(auth : Text) : OutCall.Header {
    {
      name = "Authorization";
      value = "Basic " # auth;
    };
  };

  public shared ({ caller }) func verifyEmailOtp(email : Email, otp : OtpCode) : async OtpStatus {
    switch (emailOtpStore.get(email)) {
      case (null) { #notFound };
      case (?entry) {
        if (isOtpExpired(entry.timestamp)) {
          #expired;
        } else if (entry.verified) {
          #alreadyVerified;
        } else if (entry.code == otp) {
          emailOtpStore.add(email, { entry with verified = true });
          #verified;
        } else { #invalid };
      };
    };
  };

  public shared ({ caller }) func verifyPhoneOtp(phone : PhoneNumber, otp : OtpCode) : async OtpStatus {
    switch (phoneOtpStore.get(phone)) {
      case (null) { #notFound };
      case (?entry) {
        if (isOtpExpired(entry.timestamp)) {
          #expired;
        } else if (entry.verified) {
          #alreadyVerified;
        } else if (entry.code == otp) {
          phoneOtpStore.add(phone, { entry with verified = true });
          #verified;
        } else { #invalid };
      };
    };
  };

  public shared ({ caller }) func linkEmailToProfile(email : Email) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can link emails");
    };

    switch (emailOtpStore.get(email)) {
      case (null) {
        Runtime.trap("OTP verification required before linking email");
      };
      case (?entry) {
        if (not entry.verified) {
          Runtime.trap("Email must be verified before linking");
        };
      };
    };

    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("User profile not found. Create a profile first.");
    };
  };

  public shared ({ caller }) func linkPhoneToProfile(phone : PhoneNumber) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can link phone numbers");
    };

    switch (phoneOtpStore.get(phone)) {
      case (null) {
        Runtime.trap("OTP verification required before linking phone number");
      };
      case (?entry) {
        if (not entry.verified) {
          Runtime.trap("Phone number must be verified before linking");
        };
      };
    };

    if (not userProfiles.containsKey(caller)) {
      Runtime.trap("User profile not found. Create a profile first.");
    };
  };

  // ------------ Twilio Configuration (Admin Only) ------------
  public shared ({ caller }) func setTwilioConfiguration(config : TwilioConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    twilioConfiguration := ?config;
  };

  // Public query - accessible to all including guests
  public query ({ caller }) func isTwilioConfigured() : async Bool {
    twilioConfiguration != null;
  };

  func getTwilioConfiguration() : TwilioConfiguration {
    switch (twilioConfiguration) {
      case (null) { Runtime.trap("Twilio needs to be first configured") };
      case (?value) { value };
    };
  };

  // ------------ User Profile Functions ------------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ------------ Stripe Configuration ------------
  // Public query - accessible to all including guests
  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };
};
