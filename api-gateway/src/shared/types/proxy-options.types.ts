import { Logger } from "winston";

export interface ProxyOptions {
  target: string;
  changeOrigin: boolean;
  pathRewrite?: Record<string, string>;
  timeout: number;
  logger?: Logger;

  on?: {
    error?: (err: Error, req: any, res: any) => void;
    proxyReq?: (proxyReq: any, req: any, res: any) => void;
    proxyRes?: (proxyRes: any, req: any, res: any) => void;
  };
}
