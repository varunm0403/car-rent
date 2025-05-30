/**
 * Application Configuration
 * Central location for all configuration settings
 */

// User roles
const USER_ROLES = {
  ADMIN: "Admin",
  SUPPORT_AGENT: "Support",
  CUSTOMER: "Client",
  VISITOR: "Visitor",
};

// Booking statuses
const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  RESERVED: "reserved",
  RESERVED_BY_SUPPORT_AGENT: "reserved_by_support_agent",
  SERVICE_STARTED: "service_started",
  SERVICE_COMPLETED: "service_completed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Payment statuses
const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
};

// Car categories
const CAR_CATEGORY = {
  ECONOMY: "economy",
  COMPACT: "compact",
  MID_SIZE: "mid-size",
  FULL_SIZE: "full-size",
  LUXURY: "luxury",
  SUV: "suv",
  VAN: "van",
  HATCHBACK:"hatchback",
  MINIVAN:"minivan",
  CROSSOVER: "crossover",
  BUSINESS: "business",
  LUXURY: "luxury",
  SEDAN: "sedan",
  PREMIUM: "premium",
  COMFORT: "comfort"

};

// Fuel types
const FUEL_TYPE = {
  PETROL: "petrol",
  DIESEL: "diesel",
  ELECTRIC: "electric",
  HYBRID: "hybrid",
};

// Transmission types
const TRANSMISSION_TYPE = {
  MANUAL: "manual",
  AUTOMATIC: "automatic",
};

// Report types
const REPORT_TYPE = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  CUSTOM: "custom",
};

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || "",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
};

// JWT configuration
const JWT_CONFIG = {
  secret:
    process.env.JWT_SECRET ||
    "c60b356c446717a892365db72772df8281605184b9c34b0453fc9a699d5e3b349f75ab162047dcdace34cdcc4aaa0f37b0bfd05619306a66a887c7b5372feaae490731b915919f7308b224730a61b43c7b0db35d7d8801a1118edd647898fdd37c82c62970c1ae11c41958fffb6950252d26dd9d5b6cdf09f0146011442667a79718f1c944ffa6efc7f80a4030d99d900ee0e13eb0781104013ef9e7a58f12bf",
  expiresIn: "24h",
};

// Export all configuration
module.exports = {
  USER_ROLES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  CAR_CATEGORY,
  FUEL_TYPE,
  TRANSMISSION_TYPE,
  REPORT_TYPE,
  EMAIL_CONFIG,
  JWT_CONFIG,
};
