/// <reference types="node" />
import mongoose from "mongoose";
import "dotenv/config";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/user-service",
  );
  console.log("Connected to MongoDB for seeding.");

  await UserModel.deleteMany({});

  const u1 = new UserModel({
    _id: new mongoose.Types.ObjectId("650b8b8a0f9b8c001c8e4b1a"),
    name: "Ajex Joshy",
    email: "ajex@example.com",
  });

  const u2 = new UserModel({
    _id: new mongoose.Types.ObjectId("650b8b8a0f9b8c001c8e4b1b"),
    name: "Demo User",
    email: "demo@example.com",
  });

  await u1.save();
  await u2.save();

  console.log("Users seeded.");
  mongoose.disconnect();
}

seed().catch(console.error);
