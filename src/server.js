import express from "express";
import mongoose from "mongoose";
import { create } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { __dirname } from "./path.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import multeRouter from "./routes/img.routes.js";
import fs from "fs/promises";

const app = express();
const hbs = create();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log("Server on port", PORT);
});

await mongoose
  .connect(
    "mongodb+srv://sarmientoemmanuel02:Godoy.Cruz.21@cluster0.zbbys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("BBD conectado"))
  .catch((e) => console.log("Error al conectar bbd:", e));

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/upload", multeRouter);

app.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "db", "products.json"),
      "utf-8"
    );
    const products = JSON.parse(data);
    res.render("templates/home", { productos: products });
  } catch (err) {
    res.status(500).send("Error al leer el archivo de productos");
  }
});

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);
  socket.on("mensaje", (data) => {
    console.log("Mensaje recibido: ", data);
    socket.emit("respuesta", "Mensaje recibido: ", data);
  });
  socket.on("disconnect", () => {
    console.log("Usuario desconectado: ", socket.id);
  });
});
