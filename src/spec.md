# Specification

## Summary
**Goal:** Rebuild the complete Fresh Dabbawala multi-tenant food delivery platform with all existing features including backend data models, four standalone PWA apps (Customer, Delivery, Restaurant, Admin), authentication system, and PWA functionality.

**Planned changes:**
- Rebuild complete Motoko backend with all data models (Meal, Order, RestaurantProfile, DeliveryPartner, CustomerProfile, DabbaBooking) and OTP authentication supporting Twilio SMS and email verification
- Rebuild multi-tenant PWA architecture with four standalone apps detectable via URL parameters, subdomains, or paths
- Rebuild authentication system supporting Internet Identity and OTP login (email and phone) for all app types with profile setup flows
- Rebuild customer app with meal browsing, subscription ordering, dabba booking flow with pickup/drop addresses and time slots, order history, and booking management
- Rebuild restaurant partner app with meal management (create, edit, image upload), order viewing, and revenue tracking dashboard
- Rebuild delivery partner app with availability toggle, assigned orders and bookings dashboard, status update controls, and earnings tracking
- Rebuild admin app with statistics dashboard, management interfaces for customers, restaurants, delivery partners, and orders with CSV export, plus Twilio configuration panel
- Rebuild PWA functionality with app-specific manifests, service worker with aggressive caching strategies, install prompts, and offline support
- Rebuild theming system with OKLCH color schemes for each app variant (customer green, delivery blue, restaurant orange, admin slate) with light/dark mode support
- Rebuild React Query integration with hooks for all backend operations with localStorage fallback

**User-visible outcome:** Users can access four fully functional PWA apps (Customer, Delivery, Restaurant, Admin) for the Fresh Dabbawala food delivery platform with complete authentication, meal ordering, subscription management, dabba booking, delivery tracking, restaurant management, and admin controls, all working offline with PWA capabilities.
