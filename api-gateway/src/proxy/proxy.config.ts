import { ENV } from "@config/env.config.js";
import { ServiceConfig } from "@shared/types/service-config.types.js";

export const serviceConfigs: ServiceConfig[] = [
  {
    path: "/api/v1/users/",
    url: ENV.USER_SERVICE_URL,
    pathRewrite: { "^/": "/api/v1/users" },
    name: "auth-service",
    timeout: 5000,
  },
  {
    path: "/api/v1/orders/",
    url: ENV.ORDER_SERVICE_URL,
    pathRewrite: { "^/": "/api/v1/orders" },
    name: "order-service",
  },
];
