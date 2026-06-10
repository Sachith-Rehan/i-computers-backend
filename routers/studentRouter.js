import express from "express";
import Student from "../models/student.js";
import { getAllStudents, createStudent } from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.get("/" , getAllStudents);

studentRouter.post("/" , createStudent);


export default studentRouter;