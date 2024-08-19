import mongoose from "mongoose";
import { Constants } from "../contants.js";

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(
      `${Constants.MONGODB_URL}/${Constants.DB_NAME}`
    );
    console.log(
      `MongoDB Connected!! DB Host: ${connectInstance.connection.host}`
    );
  } catch (error) {
    console.log("ERROR:", error);
    process.exit(1);
  }
};

export default connectDB;
