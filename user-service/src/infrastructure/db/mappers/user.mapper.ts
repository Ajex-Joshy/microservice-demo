import { User, UserRole } from "@domain/entities/user.entity";

export const mapToDomain = (data: Record<string, unknown>): User => {
  return new User(
    String(data._id),
    String(data.name),
    String(data.email),
    String(data.passwordHash),
    mapToUserRole(String(data.role)),
  );
};

export const mapToPersistence = (user: User) => {
  return {
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
  };
};

const mapToUserRole = (role: string): UserRole => {
  if (!Object.values(UserRole).includes(role as UserRole)) {
    throw new Error(`Invalid role: ${role}`);
  }
  return role as UserRole;
};
