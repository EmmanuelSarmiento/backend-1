import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controllers.js";

const productRouter = Router();

//Consulto por un productos
productRouter.get("/", getProducts);

//Consulto por un producto segun su id
productRouter.get("/:pid", getProduct);

//Creo un nuevo producto
productRouter.post("/", createProduct);

//Actualizo un producto dado su id y pido los datos a actualizar del cuerpo de la peticion
productRouter.put("/:pid", updateProduct);

//Elimino el producto por su id
productRouter.delete("/:pid", deleteProduct);

export default productRouter;
