import { AsyncLocalStorage } from "async_hooks";

export interface TracingContext {
	correlationId: string;
}

export const tracingStorage = new AsyncLocalStorage<TracingContext>();

export const getCorrelationId = (): string | undefined => {
	return tracingStorage.getStore()?.correlationId;
};
