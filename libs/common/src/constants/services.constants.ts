export const SERVICES = {
  API_GATEWAY: "api_gateway",
  AUTH_SERVICE: "auth_service",
  USER_SERVICE: "user_service",
  EVENT_SERVICE: "event_service",
  TICKETS_SERVICE: "tickets_service",
  PAYMENTS_SERVICE: "payments_service",
  NOTIFICATION_SERVICE: "notification_service",
} as const;

export const SERVICES_PORT = {
  API_GATEWAY: 3000,
  AUTH_SERVICE: 3001,
  USER_SERVICE: 3002,
  EVENT_SERVICE: 3003,
  TICKETS_SERVICE: 3004,
  PAYMENTS_SERVICE: 3005,
  NOTIFICATION_SERVICE: 3006,
} as const;
