// Original file: proto/user.proto

import type * as grpc from "@grpc/grpc-js";
import type { MethodDefinition } from "@grpc/proto-loader";
import type {
	GetUserRequest as _user_GetUserRequest,
	GetUserRequest__Output as _user_GetUserRequest__Output,
} from "../user/GetUserRequest";
import type {
	GetUserResponse as _user_GetUserResponse,
	GetUserResponse__Output as _user_GetUserResponse__Output,
} from "../user/GetUserResponse";

export interface UserServiceClient extends grpc.Client {
	GetUser(
		argument: _user_GetUserRequest,
		metadata: grpc.Metadata,
		options: grpc.CallOptions,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
	GetUser(
		argument: _user_GetUserRequest,
		metadata: grpc.Metadata,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
	GetUser(
		argument: _user_GetUserRequest,
		options: grpc.CallOptions,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
	GetUser(
		argument: _user_GetUserRequest,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
	getUser(
		argument: _user_GetUserRequest,
		metadata: grpc.Metadata,
		options: grpc.CallOptions,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
	getUser(
		argument: _user_GetUserRequest,
		metadata: grpc.Metadata,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
	getUser(
		argument: _user_GetUserRequest,
		options: grpc.CallOptions,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
	getUser(
		argument: _user_GetUserRequest,
		callback: grpc.requestCallback<_user_GetUserResponse__Output>,
	): grpc.ClientUnaryCall;
}

export interface UserServiceHandlers extends grpc.UntypedServiceImplementation {
	GetUser: grpc.handleUnaryCall<
		_user_GetUserRequest__Output,
		_user_GetUserResponse
	>;
}

export interface UserServiceDefinition extends grpc.ServiceDefinition {
	GetUser: MethodDefinition<
		_user_GetUserRequest,
		_user_GetUserResponse,
		_user_GetUserRequest__Output,
		_user_GetUserResponse__Output
	>;
}
