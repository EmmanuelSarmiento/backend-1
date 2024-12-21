import { Router } from "express";
import crypto from "crypto";
import { __dirname } from "../path.js";
import { promises as fs } from "fs";
import path from "path";

const cartRouter = Router();

const cartsPath = path.resolve(__dirname, "../src/db/carts.json");

//Leo el archivo json
const cartsData = await fs.readFile(cartsPath, "utf-8");
const carts = JSON.parse(cartsData);

//Consulto por productos guardados en ese carrito
cartRouter.get("/:cid", (req, res) => {
  const idCart = req.params.cid;
  const cart = carts.find((cart) => cart.id == idCart);
  if (cart) {
    res.status(200).send(cart.products);
  } else {
    res.status(404).send({ mensaje: "El carrito no existe" });
  }
});

//Creo un nuevo carrito
cartRouter.post("/", async (req, res) => {
  const newCart = {
    id: crypto.randomBytes(5).toString("hex"),
    products: [],
  };
  carts.push(newCart);
  await fs.writeFile(cartsPath, JSON.stringify(carts));
  res.status(200).send(`Carrito creado corretamente ${newCart.id}`);
});

//Agrego un nuevo producto a ese carrito
cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const { quantity } = req.body;
  const cart = carts.find((cart) => cart.id == idCart);
  if (cart) {
    const index = cart.products.findIndex((prod) => prod.id == idProduct);
    if (index != -1) {
      cart.products[index].quantity = quantity;
    } else {
      cart.products.push({ id: idProduct, quantity: quantity });
    }
    await fs.writeFile(cartsPath, JSON.stringify(carts));
    res.status(200).send("Se actualizo el carrito");
  } else {
    res.status(404).send({ mensaje: "No existe el carrito" });
  }
});

export default cartRouter;
