// User roles
export const USER_ROLES = {
  ADMIN: "Admin",
  SUPPORT_AGENT: "Support",
  CUSTOMER: "Client",
  VISITOR: "Visitor",
};

// Booking statuses
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  RESERVED: "reserved",
  RESERVED_BY_SUPPORT_AGENT: "reserved_by_support_agent",
  SERVICE_STARTED: "service_started",
  SERVICE_COMPLETED: "service_completed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Report types
export const REPORT_TYPE = {
  SALES: "SALES",
  SUPPORT_AGENT_PERFORMANCE: "SUPPORT_AGENT_PERFORMANCE",
};

// File formats
export const FILE_FORMAT = {
  CSV: "CSV",
  XLSX: "XLSX",
  PDF: "PDF",
};

// Email configuration
export const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || "",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
};

// File storage configuration
export const STORAGE_CONFIG = {
  reportsDir: process.env.REPORTS_DIR || './reports/files',
  baseUrl: process.env.BASE_URL || 'http://localhost:3003/reports/files'
};