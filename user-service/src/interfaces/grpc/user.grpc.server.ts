import path from "node:path";
import { container } from "@config/di/container";
import { TYPES } from "@config/di/types";
import { ENV } from "@config/env.config";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import type { UserGrpcController } from "@interfaces/grpc/controllers/user.grpc.controller";
import { logger } from "@shared/logger/logger";
import type { ProtoGrpcType } from "./generated/user";

const protoPath = path.resolve(process.cwd(), "proto/user.proto");

const packageDef = protoLoader.loadSync(protoPath);

const proto = grpc.loadPackageDefinition(
  packageDef,
) as unknown as ProtoGrpcType;

import { tracingStorage } from "@shared/tracing/tracing-context";
import { randomUUID } from "crypto";

const controller = container.get<UserGrpcController>(TYPES.UserGrpcController);

export const server = new grpc.Server();

server.addService(proto.user.UserService.service, {
  GetUser: (call: any, callback: any) => {
    const correlationId = call.metadata.get("x-correlation-id")[0] || randomUUID();
    tracingStorage.run({ correlationId }, () => {
      controller.GetUser(call, callback);
    });
  },
});

export const startGrpcServer = async () => {
  const PORT = ENV.GRPC_PORT;

  return new Promise<void>((resolve, reject) => {
    const bindAddr = PORT.includes(":") ? PORT : `0.0.0.0:${PORT}`;
    console.log(`[DEBUG] GPRC_PORT value: "${PORT}"`);
    console.log(`[DEBUG] Final gRPC Bind Address: "${bindAddr}"`);
    server.bindAsync(
      bindAddr,
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
