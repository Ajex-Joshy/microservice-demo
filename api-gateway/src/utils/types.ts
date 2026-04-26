export const AUTH = {
  STRATEGY: "jwt",
  BEARER_PREFIX: "Bearer ",
} as const;

export const HEADERS = {
  USER_ID: "x-user-id",
  USER_ROLE: "x-user-role",
  CORRELATION_ID: "x-correlation-id",
} as const;
