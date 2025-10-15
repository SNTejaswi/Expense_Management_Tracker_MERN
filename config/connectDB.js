import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log(`MongoDB Connected: ${mongoose.connection.host}`.green.bold);
  } catch (error) {
    console.log(`MongoDB Connection Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
