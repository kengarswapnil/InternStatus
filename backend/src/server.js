import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/database.js";

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET",
});

const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(PORT, () => {
      console.log("Server is running on Port " + PORT);
    });
  })
  .catch((err) => console.log("ERROR:", err.message));