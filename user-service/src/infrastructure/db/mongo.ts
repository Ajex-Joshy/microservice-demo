import mongoose from "mongoose";
import { ENV } from "../../config/env.config";
import { DatabaseException } from "../exceptions/Database.exception";
import { logger } from "../../shared/logger/logger";

export const connectDB = async (): Promise<void> => {
  try {
    const uri = ENV.MONGO_URI;

    if (!uri) throw new DatabaseException("Database connection failed");
    await mongoose.connect(uri);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(error, "MongoDB connection error:");
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error(error, "MongoDB disconnection error:");
    throw error;
  }
};
