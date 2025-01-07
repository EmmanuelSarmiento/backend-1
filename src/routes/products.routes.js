import { Router } from "express";
import crypto from "crypto";
import { __dirname } from "../path.js";
import { promises as fs } from "fs";
import path from "path";

const productRouter = Router();

const productsPath = path.resolve(__dirname, "../src/db/products.json");

//Leo el archivo json
async function getProducts() {
  const productsData = await fs.readFile(productsPath, "utf-8");
  return JSON.parse(productsData);
}

//Consulto por un productos
productRouter.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let products = await getProducts();
    if (limit) {
      products = products.slice(0, limit);
    }
    res.status(200).render("templates/home", { productos: products });
  } catch (err) {
    res.status(500).send("Error al leer el archivo de productos");
  }
});

//Consulto por un producto segun su id
productRouter.get("/:pid", async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const products = await getProducts();
    const product = products.find((prod) => prod.id == idProduct);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ mensaje: "El producto no existe" });
    }
  } catch (err) {
    res.status(500).send("Error al leer el archivo de productos");
  }
});

//Creo un nuevo producto
productRouter.post("/", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    const products = await getProducts();
    const newProduct = {
      id: crypto.randomBytes(10).toString("hex"),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: [],
    };
    products.push(newProduct);
    await fs.writeFile(productsPath, JSON.stringify(products));
    res.status(201).send({
      mensaje: `Producto creado correctamente con el id: ${newProduct.id}`,
    });
  } catch (err) {
    res.status(500).send("Error al crear el producto");
  }
});

//Actualizo un producto dado su id y pido los datos a actualizar del cuerpo de la peticion
productRouter.put("/:pid", async (req, res) => {
  try {
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
    const products = await getProducts();
    const index = products.findIndex((prod) => prod.id == idProduct);
    if (index != -1) {
      products[index] = {
        ...products[index],
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
        status,
      };
      await fs.writeFile(productsPath, JSON.stringify(products));
      res.status(200).send({ mensaje: "Producto actualizado" });
    } else {
      res.status(404).send({ mensaje: "El producto no existe" });
    }
  } catch (err) {
    res.status(500).send("Error al actualizar el producto");
  }
});

//Elimino el producto por su id
productRouter.delete("/:pid", async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const products = await getProducts();
    const index = products.findIndex((prod) => prod.id == idProduct);
    if (index != -1) {
      products.splice(index, 1);
      await fs.writeFile(productsPath, JSON.stringify(products));
      res.status(200).send({ mensaje: "Producto eliminado" });
    } else {
      res.status(404).send({ mensaje: "El producto no existe" });
    }
  } catch (err) {
    res.status(500).send("Error al eliminar el producto");
  }
});

export default productRouter;
