import cartsModel from "../models/carts.models.js";

export const getCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsModel.findById(cartId);
    res.status(200).send(cart);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const createCart = async (req, res) => {
  try {
    const respuesta = await cartsModel.create({ products: [] });
    res.status(201).send(respuesta);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const insertProductCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    const cart = await cartModel.findById(cartId);
    if (cart) {
      const index = cart.products.findIndex(
        //consulta si el producto ya esta en el carrito o no
        (prod) => prod.id_prod == productId
      );
      if (index != -1) {
        //si ya esta en el carrito, solo actualiza la cantidad
        cart.products[index].quantity = quantity;
      } else {
        //si no esta en el carrito, lo agrega
        cart.products.push({ id_prod: productId, quantity: quantity });
      }
      const respuesta = await cartModel.findByIdAndUpdate(cartId, cart); //guardo los cambios
      return res.status(200).send(respuesta);
    } else {
      res.status(404).send("Carrito no existe");
    }
  } catch (e) {
    res.status(500).send(e);
  }
};
