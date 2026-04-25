import { injectable } from "inversify";
import jwt from "jsonwebtoken";

@injectable()
export class JwtService {
	private readonly secret = process.env.JWT_SECRET || "default_secret";

	verify(token: string) {
		return jwt.verify(token, this.secret);
	}
}
