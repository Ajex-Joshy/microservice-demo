import { Container } from "inversify";
import { RegisterUser } from "@application/use-cases/register-user.use-case";
import { TYPES } from "@config/di/types";
import { UserRole } from "@domain/entities/user.entity";
import { logger } from "@shared/logger/logger";

export const seedAdmin = async (container: Container) => {
  try {
    const registerUser = container.get<RegisterUser>(TYPES.RegisterUser);

    const adminEmail = "admin@email.com";
    const adminPassword = "AdminPassword123!";
    const adminName = "Default Administrator";

    try {
      await registerUser.execute(
        adminName,
        adminEmail,
        adminPassword,
        UserRole.ADMIN
      );
      logger.info(`[Seed] Default admin user created: ${adminEmail}`);
    } catch (error: any) {
      if (error.message?.includes("already exists")) {
        logger.info("[Seed] Admin user already exists, skipping seed.");
      } else {
        throw error;
      }
    }
  } catch (error) {
    logger.error(error, "[Seed] Error seeding admin user:");
  }
};
