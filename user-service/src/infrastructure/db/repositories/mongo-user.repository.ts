import type { User } from "@domain/entities/user.entity";
import type { IUserRepository } from "@domain/repositories/user.repository.interface";
import {
  mapToDomain,
  mapToPersistence,
} from "@infrastructure/db/mappers/user.mapper";
import { UserModel } from "@infrastructure/db/models/user.model";
import { DatabaseException } from "@infrastructure/exceptions/Database.exception";
import { injectable } from "inversify";

@injectable()
export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const data = await UserModel.findById(id);
      if (!data) return null;

      return mapToDomain(data.toObject() as Record<string, unknown>);
    } catch (_error) {
      throw new DatabaseException(`Failed to find user by id: ${id}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const data = await UserModel.findOne({ email });
      if (!data) return null;

      return mapToDomain(data.toObject() as Record<string, unknown>);
    } catch (_error) {
      throw new DatabaseException(`Failed to find user by email: ${email}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const persistence = mapToPersistence(user);

      const created = await UserModel.create(persistence);

      return mapToDomain(created.toObject() as Record<string, unknown>);
    } catch (_error) {
      throw new DatabaseException("Failed to create user");
    }
  }
}
