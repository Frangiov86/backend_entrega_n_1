const express = require("express");
const app = express();

// Importar routers.
const productsRouter = require("./products/products");
const cartsRouter = require("./carts/carts");

// Middleware utilizado.
app.use(express.json());

// Uso de rutas.
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
