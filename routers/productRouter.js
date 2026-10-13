import express from "express";
import { createProduct , getAllProducts , deleteProduct , updateProduct ,getProductById, getProductBycategory} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/" , createProduct);
productRouter.get("/" , getAllProducts);
productRouter.get("/:productId" , getProductById);
productRouter.get("/category/:category", getProductBycategory);
productRouter.put("/:productId" , updateProduct);   
productRouter.delete("/:productId" , deleteProduct);


export default productRouter;