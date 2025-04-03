const fs = require("fs").promises;
const path = require("path");

// Ruta linkeada y absoluta al archivo carts.json
const cartsPath = path.join(__dirname, "../data/carts.json");

class CartManager {
  //  Obtiene  todos los carritos desde el archivo.
  async getAll() {
    try {
      const data = await fs.readFile(cartsPath, "utf-8");
      return JSON.parse(data); // Devuelve el array de carros.
    } catch {
      return []; // Si no existe o hay error, devuelve array vacío
    }
  }

  //  Guardar todos los carritos en el archivo
  async saveAll(carts) {
    await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
  }

  //  Crear un nuevo carrito con ID único y lista de productos vacía
  async createCart() {
    const carts = await this.getAll();
    const newId =
      carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1;

    const newCart = {
      id: newId,
      products: [], // Lista vacía de productos
    };

    carts.push(newCart);
    await this.saveAll(carts);
    return newCart; // Devuelve el carrito recién creado
  }

  //  Buscar un carrito por su ID
  async getById(id) {
    const carts = await this.getAll();
    return carts.find((c) => c.id === id); // Devuelve el carrito si existe
  }

  //  Agregar un producto a un carrito existente
  async addProductToCart(cartId, productId) {
    const carts = await this.getAll();
    const cart = carts.find((c) => c.id === cartId);

    if (!cart) return null; // Si no existe el carrito

    // Buscar si el producto ya está en el carrito
    const existing = cart.products.find((p) => p.product === productId);

    if (existing) {
      existing.quantity += 1; // Si ya existe, aumenta cantidad
    } else {
      cart.products.push({ product: productId, quantity: 1 }); // Si no existe, lo agrega
    }

    await this.saveAll(carts);
    return cart; // Devuelve el carrito actualizado
  }
}

module.exports = new CartManager();
