// importing the express module from express package
import express from "express";
// Fixed typo: imported as 'mongoose' instead of 'mongoos'
import mongoose from "mongoose";

import studentRouter from "./routers/studentRouter.js";
import userRouter from "./routers/userRouter.js"; 
import productRouter from "./routers/productRouter.js";

import jwt from "jsonwebtoken";
import authenticate from "./middlewares/authenticate.js";


// Make sure your password doesn't contain special characters that need URL encoding
const mongoDBURI = "mongodb://admin1234:admin1234@ac-s7dmdur-shard-00-00.f19cb5u.mongodb.net:27017,ac-s7dmdur-shard-00-01.f19cb5u.mongodb.net:27017,ac-s7dmdur-shard-00-02.f19cb5u.mongodb.net:27017/?ssl=true&replicaSet=atlas-t236xc-shard-0&authSource=admin&appName=Cluster0";

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

// middleware to parse the body of the request
app.use(express.json());
app.use(authenticate);


app.use("/student" , studentRouter);
app.use("/user" , userRouter);
app.use("/product" , productRouter);




// start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});