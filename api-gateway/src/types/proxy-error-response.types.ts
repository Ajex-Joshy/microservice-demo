export interface ProxyErrorResponse {
  message: string;
  status: number;
  timestamp: string;
  correlationId?: string;
}
