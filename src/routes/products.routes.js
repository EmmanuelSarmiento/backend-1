import { Router } from "express";
import crypto from "crypto";
import { __dirname } from "../path.js";
import { promises as fs } from "fs";
import path from "path";

const productRouter = Router();

const productsPath = path.resolve(__dirname, "../src/db/products.json");

//Leo el archivo json
const productsData = await fs.readFile(productsPath, "utf-8");
const products = JSON.parse(productsData);

//Consulto por un productos
productRouter.get("/", (req, res) => {
  const { limit } = req.query;
  const products = products.splice(0, limit);
  res.status(200).send(products);
});

//Consulto por un producto segun su id
productRouter.get("/:pid", (req, res) => {
  const idProduct = req.params.pid;
  const product = products.find((prod) => prod.id == idProduct);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ mensaje: "El producto no existe" });
  }
});

//Creo un nuevo producto
productRouter.post("/", async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  const newproducts = {
    id: crypto.randomBytes(10).toString("hex"),
    title: title,
    description: description,
    code: code,
    price: price,
    status: true,
    stock: stock,
    category: category,
    thumbnails: [],
  };
  products.push(newproducts);
  await fs.writeFile(productsPath, JSON.stringify(products)); //Reescribo el nuevo JSON con el nuevo producto
  res.status(201).send({
    mensaje: `Producto creado correctamente con el id: ${newproducts.id}`,
  });
});

//Actualizo un producto dado su id y pido los datos a actualizar del cuerpo de la peticion
productRouter.put("/:pid", async (req, res) => {
  const idProduct = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status,
  } = req.body;
  const index = products.findIndex((prod) => prod.id == idProduct);
  if (index != -1) {
    products[index].title = title;
    products[index].description = description;
    products[index].code = code;
    products[index].price = price;
    products[index].status = status;
    products[index].stock = stock;
    products[index].category = category;
    products[index].thumbnails = thumbnails;
    await fs.writeFile(productsPath, JSON.stringify(products));
    res.status(200).send({ mensaje: "Producto actualizado" });
  } else {
    res.status(404).send({ mensaje: "El producto no existe" });
  }
});

//Elimino el producto por su id
productRouter.delete("/:pid", async (req, res) => {
  const idProduct = req.params.pid;
  const index = products.findIndex((prod) => prod.id == idProduct);
  if (index != -1) {
    products.splice(index, 1);
    await fs.writeFile(productsPath, JSON.stringify(products));
    res.status(200).send({ mensaje: "Producto eliminado" });
  } else {
    res.status(404).send({ mensaje: "El producto no existe" });
  }
});

export default productRouter;
