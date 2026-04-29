import { createProxyMiddleware, Options as ProxyOptions } from "http-proxy-middleware";
import { ServiceConfig } from "@custom-types/service-config.types";
import { ProxyHandlers } from "./proxy.handlers";
import { ENV } from "@config/env.config";
import logger from "@config/logger.config";

/**
 * Factory for creating configured proxy middleware instances.
 */
export class ProxyFactory {
  public static create(service: ServiceConfig) {
    const options: ProxyOptions = {
      target: service.url,
      changeOrigin: true,
      pathRewrite: service.pathRewrite,
      timeout: Number(service.timeout) || Number(ENV.DEFAULT_TIMEOUT),
      logger: logger,
      on: {
        error: ProxyHandlers.handleProxyError,
        proxyReq: ProxyHandlers.handleProxyRequest,
        proxyRes: ProxyHandlers.handleProxyResponse,
      },
    };

    return createProxyMiddleware(options);
  }
}
