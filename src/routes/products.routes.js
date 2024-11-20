import { Router } from "express";
import crypyo from "crypto";

const productRouter = Router();

const products = [];

app.get("/api/products", (req, res) => {
  res.status(200).send(products);
});

app.get("/api/products/:idP", (req, res) => {
  const idProduct = req.params.idP;
  const product = products.find((prod) => prod.id == idProduct);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ mensaje: "El producto no existe" });
  }
});

app.post("/api/products", (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;
  const newproducts = {
    id: crypyo.randomBytes(10).toString("hex"),
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
  };
  products.push(newproducts);
  res.status(201).send({
    mensaje: `Producto creado correctamente con el id: ${newproducts.id}`,
  });
});

app.put("/api/products/:idP", (req, res) => {
  const idProduct = req.params.idP;
  const { title, description, code, price, status, stock, category } = req.body;
  const index = products.findIndex((prod) => prod.id == idProduct);
  if (index != -1) {
    products[index].title = title;
    products[index].description = description;
    products[index].code = code;
    products[index].price = price;
    products[index].status = status;
    products[index].stock = stock;
    products[index].category = category;
    res.status(200).send({ mensaje: "Producto actualizado" });
  } else {
    res.status(404).send({ mensaje: "El producto no existe" });
  }
});

app.delete("/api/products/:idP", (req, res) => {
  const idProduct = req.params.idP;
  const index = products.findIndex((prod) => prod.id == idProduct);
  if (index != -1) {
    products.slice(index, 1);
    res.status(200).send({ mensaje: "Producto eliminado" });
  } else {
    res.status(404).send({ mensaje: "El producto no existe" });
  }
});