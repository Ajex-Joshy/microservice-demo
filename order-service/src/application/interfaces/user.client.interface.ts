export interface IUserServiceClient {
	getUserRole(userId: string): Promise<string | null>;
}
