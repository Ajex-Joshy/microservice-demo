import { IncomingMessage } from "http";
import { fixRequestBody } from "http-proxy-middleware";
import logger from "@config/logger.config";
import { HTTP_STATUS } from "@utils/http-status";
import { ProxyErrorResponse } from "@custom-types/proxy-error-response.types";
import { HEADERS } from "@utils/types";

export class ProxyHandlers {
  /**
   * Handle errors during the proxy process (e.g. downstream service down)
   */
  public static handleProxyError(err: Error, req: IncomingMessage, res: any): void {
    logger.error(`[Proxy] Error on ${req.method} ${req.url}`, {
      error: err.message,
    });

    const errorResponse: ProxyErrorResponse = {
      message: "Downstream service unavailable",
      status: HTTP_STATUS.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
    };

    // Check if it's a standard HTTP response (has writeHead)
    if (res.writeHead && !res.headersSent) {
      res.writeHead(HTTP_STATUS.SERVICE_UNAVAILABLE, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(errorResponse));
    } else if (res.destroy) {
      // If it's a socket, just destroy it
      res.destroy();
    }
  }

  public static handleProxyRequest(proxyReq: any, req: any): void {
    // Forward Verified User Context
    if (req.user) {
      proxyReq.setHeader(HEADERS.USER_ID, req.user.userId);
      proxyReq.setHeader(HEADERS.USER_ROLE, req.user.role);
    }

    // Forward Correlation ID
    const correlationId = (req as any).correlationId;
    if (correlationId) {
      proxyReq.setHeader("x-correlation-id", correlationId);
    }

    // If we have a parsed body, ensure we forward it as JSON
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }

    logger.debug(`[Proxy] Forwarding to ${req.originalUrl}`, {
      userId: req.user?.userId,
    });
  }

  /**
   * Modify response before it is sent back to the client
   */
  public static handleProxyResponse(proxyRes: IncomingMessage, req: IncomingMessage, res: any): void {
    // Header adjustments if needed
  }
}
