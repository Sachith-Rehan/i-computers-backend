import express from "express";
import { createProduct , getAllProducts , deleteProduct , updateProduct ,getProductById} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/" , createProduct);
productRouter.get("/" , getAllProducts);
productRouter.get("/:productId" , getProductById);
productRouter.put("/:productId" , updateProduct);   
productRouter.delete("/:productId" , deleteProduct);


export default productRouter;