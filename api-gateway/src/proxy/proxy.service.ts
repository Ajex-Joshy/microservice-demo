import logger from "@config/logger.config";
import { authMiddleware } from "@middlewares/auth.middleware";
import type { Application, NextFunction, Request, Response } from "express";
import { serviceConfigs } from "./proxy.config";
import { ProxyFactory } from "./proxy.factory";

/**
 * ProxyService orchestrates the registration of all API proxies.
 */
export class ProxyService {
  public static setupProxy(app: Application): void {
    serviceConfigs.forEach((service) => {
      const proxyMiddleware = ProxyFactory.create(service);

      const pipeline: any[] = [];

      // Authentication check per service
      if (service.requireAuth) {
        pipeline.push((req: Request, res: Response, next: NextFunction) => {
          const isPublic = service.publicRoutes?.some((route) =>
            req.path.startsWith(route),
          );
          if (isPublic) {
            return next();
          }
          return authMiddleware(req, res, next);
        });
      }

      // Add the proxy middleware
      pipeline.push(proxyMiddleware);

      // Register with Express
      app.use(service.path, ...pipeline);

      logger.info(
        `[Proxy] Service Registered: ${service.name} mounted at ${service.path} (Auth: ${!!service.requireAuth})`,
      );
    });
  }
}
