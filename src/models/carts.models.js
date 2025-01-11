import { Schema, model } from "mongoose";

const cartsSchema = new Schema({
  products: {
    type: [
      {
        id_prod: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

const cartsModel = model("carts", cartsSchema);

export default cartsModel;
