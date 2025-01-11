import { Router } from "express";
import {
  getCart,
  createCart,
  insertProductCart,
} from "../controllers/carts.controllers.js";

const cartRouter = Router();

//Consulto por productos guardados en ese carrito
cartRouter.get("/:cid", getCart);

//Creo un nuevo carrito
cartRouter.post("/", createCart);

//Agrego un nuevo producto a ese carrito
cartRouter.post("/:cid/products/:pid", insertProductCart);

export default cartRouter;
