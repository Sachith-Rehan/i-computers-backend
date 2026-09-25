import express from "express";
import { createOrder, getAllOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);
orderRouter.get("/:pageNumber/:pageSize", getAllOrders)

export default orderRouter;