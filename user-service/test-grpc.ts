import path from "node:path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import type { UserProtoGrpcType } from "./src/interfaces/grpc/types/user.grpc.types";

const protoPath = path.resolve(__dirname, "../proto/user.proto");
const packageDef = protoLoader.loadSync(protoPath);
const proto = grpc.loadPackageDefinition(
  packageDef,
) as unknown as UserProtoGrpcType;

const client = new proto.user.UserService(
  "0.0.0.0:5052",
  grpc.credentials.createInsecure(),
);

const dummyId = "60a7c8b0e7178351586f1234";

client.GetUser({ userId: dummyId }, (err, response) => {
  if (err) {
    console.error("gRPC Error:", err.message);
    process.exit(1);
  } else {
    console.log("Response:", response);
    process.exit(0);
  }
});
