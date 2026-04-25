import path from "node:path";
import { container } from "@config/di/container";
import { TYPES } from "@config/di/types";
import { ENV } from "@config/env.config";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import type { UserGrpcController } from "@interfaces/grpc/controllers/user.grpc.controller";
import type { UserProtoGrpcType } from "@interfaces/grpc/types/user.grpc.types";
import { logger } from "@shared/logger/logger";

const protoPath = path.resolve(__dirname, "../../../../proto/user.proto");

const packageDef = protoLoader.loadSync(protoPath);

const proto = grpc.loadPackageDefinition(
  packageDef,
) as unknown as UserProtoGrpcType;

const controller = container.get<UserGrpcController>(TYPES.UserGrpcController);

export const server = new grpc.Server();

server.addService(proto.user.UserService.service, {
  GetUser: controller.GetUser,
});

export const startGrpcServer = async () => {
  const PORT = ENV.GRPC_PORT;

  return new Promise<void>((resolve, reject) => {
    server.bindAsync(
      PORT,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          logger.error(err, "Failed to bind gRPC server");
          return reject(err);
        }

        logger.info(`gRPC server bound on ${port}`);
        resolve();
      },
    );
  });
};
