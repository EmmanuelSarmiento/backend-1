import express from "express";
import { __dirname } from "./path.js";
import productRouter from "./routes/products.routes.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(__dirname + "/public"));
app.use("/api/products", productRouter);

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
