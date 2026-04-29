import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { injectable } from "inversify";
import type { IUserServiceClient } from "@application/interfaces/user.client.interface";
import type { ProtoGrpcType } from "./generated/user";
import type { UserServiceClient } from "./generated/user/UserService";
import { getCorrelationId } from "../../shared/tracing/tracing-context";

const packageDef = protoLoader.loadSync(
	path.resolve(process.cwd(), "proto/user.proto")
);
const proto = (grpc.loadPackageDefinition(
	packageDef
) as unknown) as ProtoGrpcType;

@injectable()
export class UserGrpcClient implements IUserServiceClient {
	private client: UserServiceClient;

	constructor() {
		this.client = new proto.user.UserService(
			process.env.USER_SERVICE_URL ?? "127.0.0.1:50051",
			grpc.credentials.createInsecure()
		);
	}

	getUserRole(userId: string): Promise<string | null> {
		const metadata = new grpc.Metadata();
		const correlationId = getCorrelationId();
		if (correlationId) {
			metadata.add("x-correlation-id", correlationId);
		}

		return new Promise((resolve, reject) => {
			this.client.GetUser({ userId }, metadata, (err, response) => {
				if (err) {
					// User not found or connection error
					return resolve(null);
				}
				resolve(response?.role || null);
			});
		});
	}
}
