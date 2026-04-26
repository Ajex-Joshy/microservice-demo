import { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ENV } from "@config/env.config.js";
import logger from "@config/logger.js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants.js";
import { ServiceConfig } from "@shared/types/service-config.types.js";
import { ProxyOptions } from "@shared/types/proxy-options.types.js";
import { ProxyErrorResponse } from "@shared/types/proxy-error-response.types.js";
import { serviceConfigs } from "./proxy.config.js";

import { authMiddleware } from "@middlewares/auth.middleware.js";

export class ProxyService {
  private static createProxyOptions(service: ServiceConfig): ProxyOptions {
    return {
      target: service.url,
      changeOrigin: true,
      pathRewrite: service.pathRewrite,
      timeout: Number(service.timeout) || Number(ENV.DEFAULT_TIMEOUT),
      logger: logger,
      on: {
        error: ProxyService.handleProxyError,
        proxyReq: ProxyService.handleProxyRequest,
        proxyRes: ProxyService.handleProxyResponse,
      },
    };
  }

  private static handleProxyError(err: Error, req: any, res: any): void {
    logger.error(`Proxy error for ${req.path}:`, err);
    const errorResponse: ProxyErrorResponse = {
      message: "Service unavailable",
      status: HTTP_STATUS.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
    };

    res
      .status(HTTP_STATUS.SERVICE_UNAVAILABLE)
      .setHeader("content-type", "application/json")
      .end(JSON.stringify(errorResponse));
  }

  private static handleProxyRequest(proxyReq: any, req: any): void {
    // Forward user context from Gateway to microservices
    if (req.user) {
      proxyReq.setHeader("x-user-id", req.user.userId);
      proxyReq.setHeader("x-user-role", req.user.role);
      logger.debug(`Forwarding user context: ID=${req.user.userId}, Role=${req.user.role}`);
    }
  }

  private static handleProxyResponse(
    proxyRes: any,
    req: any,
    res: any,
  ): void {
    // Hook for response modification if needed
  }

  public static setupProxy(app: Application): void {
    serviceConfigs.forEach((service) => {
      const proxyOptions = ProxyService.createProxyOptions(service);
      
      const middlewares: any[] = [];

      if (service.requireAuth) {
        middlewares.push((req: any, res: any, next: any) => {
          // Check if the current sub-path is in publicRoutes
          const isPublic = service.publicRoutes?.some(p => req.path.startsWith(p));
          if (isPublic) {
            return next();
          }
          return authMiddleware(req, res, next);
        });
      }

      middlewares.push(createProxyMiddleware(proxyOptions as any));
      
      app.use(service.path, ...middlewares);
      
      logger.info(
        `Configured proxy for: ${service.name} at ${service.path} -> ${service.url} (Auth: ${!!service.requireAuth})`,
      );
    });
  }
}
