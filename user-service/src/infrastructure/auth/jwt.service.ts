import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.config";

@injectable()
export class JwtService {
  generate(userId: string, role: string) {
    return jwt.sign({ userId, role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRY as jwt.SignOptions["expiresIn"],
    });
  }

  verify(token: string) {
    return jwt.verify(token, ENV.JWT_SECRET);
  }
}
