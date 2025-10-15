import express from "express";
import colors from "colors";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userRoute from "./routes/userRoute.js"; 
import transactionRoutes from "./routes/transactionRoutes.js"; 

dotenv.config();
connectDB();
const app = express();
const path=require('path')

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1/users", userRoute)
app.use("/api/v1/transactions", transactionRoutes);
app.use(express.static(path.join(__dirname,'./clinet/build')))
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'));
});
const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.cyan.bold);
});
