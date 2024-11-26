import { Router } from "express";
import { uploadProds } from "../config/multer.js";

const multeRouter = Router();

multeRouter.post("/products", uploadProds.single("product"), (req, res) => {
  console.log(req);
  res.status(200).send("imagen cargada");
});

export default multeRouter;
