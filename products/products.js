const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");

//  Obtener todos los productos.
router.get("/", async (req, res) => {
  const products = await ProductManager.getAll();
  res.json(products);
});

//  Obtener un producto por ID.
router.get("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await ProductManager.getById(id);

  if (!product) {
    return res.status(404).send("Producto no encontrado");
  }

  res.json(product);
});

//  Agregar un nuevo producto.
router.post("/", async (req, res) => {
  const { description, code, price, status, stock, category, thumbnails } =
    req.body;

  const requiredFields = {
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  for (let key in requiredFields) {
    if (!requiredFields[key]) {
      return res.status(400).send(`Falta el campo obligatorio: ${key}`);
    }
  }

  const newProduct = await ProductManager.addProduct({
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  });

  res.status(201).json({
    message: "Producto creado correctamente",
    product: newProduct,
  });
});

//  Actualizar un producto.
router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const updatedProduct = await ProductManager.updateById(id, req.body);

  if (!updatedProduct) {
    return res.status(404).send("Producto no encontrado");
  }

  res.json({
    message: "Producto actualizado",
    product: updatedProduct,
  });
});

//  Eliminar un producto.
router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const deleted = await ProductManager.deleteById(id);

  if (!deleted) {
    return res.status(404).send("Producto no encontrado");
  }

  res.json({
    message: `Producto con id ${id} eliminado correctamente`,
    deleted,
  });
});

module.exports = router;
