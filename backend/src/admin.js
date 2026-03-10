import dotenv from "dotenv";
import connectDB from "./config/database.js";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await User.create({
      email,
      password, // ✅ plain text — model will hash
      role: "admin",
      isRegistered: true,
      isVerified: true,
    });

    console.log("✅ Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit();

  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();