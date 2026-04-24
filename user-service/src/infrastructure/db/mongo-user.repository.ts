import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";
import { UserModel } from "./models/user.model";

export class MonogoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    try {
      const data = await UserModel.findById(id).lean();

      if (!data) return null;

      return new User(data._id.toString(), data.name, data.email);
    } catch (error) {
      throw new Error("Error connecting to database");
    }
  }
}
