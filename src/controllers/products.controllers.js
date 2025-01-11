import productsModel from "../models/products.models.js";

export const getProducts = async (req, res) => {
  try {
    const { limit } = req.query;
    const prods = await productsModel.find().limit(limit);
    res.status(200).render("templates/home", { productos: prods });
  } catch (e) {
    res.status(500).send("Error al consultar productos: ", e);
  }
};

export const getProduct = async (req, res) => {
  try {
    const idProd = req.params.pid;
    const prod = productsModel.findById(idProd);
    if (prod) {
      res.status(200).send(prod);
    } else {
      res.status(404).send("Producto no encontrado");
    }
  } catch (e) {
    res.status(500).send("Error al consultar producto: ", e);
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = req.body;
    const respuesta = await productsModel.create(product);
    res.status(201).send("Producto creado correctamente");
  } catch (e) {
    res.status(500).send("Error en crear producto: ", e);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const idProd = req.params.pid;
    const updateProduct = req.body;
    const respuesta = await productsModel.findByIdAndUpdate(
      idProd,
      updateProduct
    );
    res.status(200).send("Producto actualizado");
  } catch (e) {
    res.status(500).send("Error en actualizar producto: ", e);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const idProd = req.params.pid;
    const respuesta = await productsModel.findByIdAndDelete(idProd);
    res.status(200).send("Producto eliminado");
  } catch (e) {
    res.status(500).send("Error en eliminar producto: ", e);
  }
};
