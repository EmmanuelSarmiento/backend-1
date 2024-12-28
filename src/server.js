import express from "express";
import { create } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { __dirname } from "./path.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/carts.routes.js";
import multeRouter from "./routes/img.routes.js";
import fs from "fs";

const app = express();
const hbs = create();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log("Server on port", PORT);
});

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/static", express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/upload", multeRouter);

app.get("/", (req, res) => {
  fs.readFile(
    path.join(__dirname, "db", "products.json"),
    "utf-8",
    (err, data) => {
      if (err) {
        return res.status(500).send("Error al leer el archivo de productos");
      }
      const products = JSON.parse(data);
      res.render("products", { products });
    }
  );
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
