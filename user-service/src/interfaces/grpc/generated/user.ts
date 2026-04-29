import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GetUserRequest as _user_GetUserRequest, GetUserRequest__Output as _user_GetUserRequest__Output } from './user/GetUserRequest';
import type { GetUserResponse as _user_GetUserResponse, GetUserResponse__Output as _user_GetUserResponse__Output } from './user/GetUserResponse';
import type { UserServiceClient as _user_UserServiceClient, UserServiceDefinition as _user_UserServiceDefinition } from './user/UserService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  user: {
    GetUserRequest: MessageTypeDefinition<_user_GetUserRequest, _user_GetUserRequest__Output>
    GetUserResponse: MessageTypeDefinition<_user_GetUserResponse, _user_GetUserResponse__Output>
    UserService: SubtypeConstructor<typeof grpc.Client, _user_UserServiceClient> & { service: _user_UserServiceDefinition }
  }
}

