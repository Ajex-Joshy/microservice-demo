import { ENV } from "@config/env.config.js";
import type { ServiceConfig } from "@custom-types/service-config.types";

export const serviceConfigs: ServiceConfig[] = [
  {
    path: "/api/v1/users/",
    url: ENV.USER_SERVICE_URL,
    pathRewrite: { "^/api/v1/users": "" },
    name: "auth-service",
    timeout: 5000,
    requireAuth: true,
    publicRoutes: ["/register", "/login", "/health"],
  },
  {
    path: "/api/v1/orders/",
    url: ENV.ORDER_SERVICE_URL,
    pathRewrite: { "^/api/v1/orders": "" },
    name: "order-service",
    requireAuth: true,
    publicRoutes: ["/health"],
  },
];
