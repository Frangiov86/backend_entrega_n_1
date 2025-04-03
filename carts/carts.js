const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");
const ProductManager = require("../managers/ProductManager"); // 👈 Importación agregada

//  Crear carrito
router.post("/", async (req, res) => {
  const newCart = await CartManager.createCart();
  res.status(201).json({
    message: "Carrito creado correctamente",
    cart: newCart,
  });
});

//  Obtener productos de un carrito
router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await CartManager.getById(cartId);

  if (!cart) {
    return res.status(404).send("Carrito no encontrado");
  }

  res.json(cart.products);
});

//  Agregar producto al carrito con validación
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  //  Verificacion de existencia del producto.
  const product = await ProductManager.getById(productId);
  if (!product) {
    return res.status(404).send(`El producto con ID ${productId} no existe`);
  }

  const updatedCart = await CartManager.addProductToCart(cartId, productId);
  if (!updatedCart) {
    return res.status(404).send("Carrito no encontrado");
  }

  res.json({
    message: "Producto agregado al carrito correctamente",
    cart: updatedCart,
  });
});

module.exports = router;
