// importing the express module from express package
import express from "express";
// Fixed typo: imported as 'mongoose' instead of 'mongoos'
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js"; 
import productRouter from "./routers/productRouter.js";
import jwt from "jsonwebtoken";
import authenticate from "./middlewares/authenticate.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();


// Make sure your password doesn't contain special characters that need URL encoding
const mongoDBURI = process.env.MONGO_URI;

// Added a .catch() block to handle connection errors gracefully
mongoose.connect(mongoDBURI)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
    });

// assigning the express to a variable called app
const app = express();

app.use(cors());
// middleware to parse the body of the request
app.use(express.json());
app.use(authenticate);



app.use("/api/users" , userRouter);
app.use("/api/products" , productRouter);




// start the server and listen on port 3000
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});