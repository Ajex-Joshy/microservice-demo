import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "node:path";
import { injectable } from "inversify";
import type { IUserServiceClient } from "@application/interfaces/user.client.interface";

const packageDef = protoLoader.loadSync(
	path.resolve(process.cwd(), "proto/user.proto")
);
const proto = grpc.loadPackageDefinition(packageDef) as grpc.GrpcObject;

@injectable()
export class UserGrpcClient implements IUserServiceClient {
	private client: any;

	constructor() {
		const Service = (proto.user as any).UserService as typeof grpc.Client;
		this.client = new Service(
			process.env.USER_SERVICE_URL ?? "127.0.0.1:50051",
			grpc.credentials.createInsecure()
		);
	}

	getUserRole(userId: string): Promise<string | null> {
		return new Promise((resolve, reject) => {
			this.client.GetUser({ userId }, (err: any, response: any) => {
				if (err) {
					// User not found or connection error
					return resolve(null);
				}
				resolve(response.role || null);
			});
		});
	}
}
