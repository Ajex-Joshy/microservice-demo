import type * as grpc from "@grpc/grpc-js";

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type GetUserCall = grpc.ServerUnaryCall<GetUserRequest, GetUserResponse>;

export type GetUserCallback = grpc.sendUnaryData<GetUserResponse>;

export interface UserProtoGrpcType {
  user: {
    UserService: grpc.ServiceClientConstructor & {
      service: grpc.ServiceDefinition;
    };
  };
}
