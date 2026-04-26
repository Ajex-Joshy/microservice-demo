import { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ENV } from "@config/env.config.js";
import logger from "@config/logger.js";
import { HTTP_STATUS } from "@shared/constants/http-status.constants.js";
import { ServiceConfig } from "@shared/types/service-config.types.js";
import { ProxyOptions } from "@shared/types/proxy-options.types.js";
import { ProxyErrorResponse } from "@shared/types/proxy-error-response.types.js";
import { serviceConfigs } from "./proxy.config.js";

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
    // Standardize user context propagation
    if (req.user) {
      proxyReq.setHeader("x-user-id", req.user.userId);
      proxyReq.setHeader("x-user-role", req.user.role);
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
      app.use(service.path, createProxyMiddleware(proxyOptions as any));
      logger.info(
        `Configured proxy for: ${service.name} at ${service.path} -> ${service.url}`,
      );
    });
  }
}
