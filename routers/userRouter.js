import express from "express";
import { createUser, getUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/create" , createUser);
userRouter.post("/login" , loginUser);
userRouter.get("/me" , getUser)
export default userRouter;
