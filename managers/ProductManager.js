const fs = require("fs").promises;
const path = require("path");

// Ruta absoluta al archivo products.json
const productsPath = path.join(__dirname, "../data/products.json");

class ProductManager {
  //  Obtener todos los productos desde el archivo
  async getAll() {
    try {
      const data = await fs.readFile(productsPath, "utf-8");
      return JSON.parse(data); // Devuelve el array de productos
    } catch {
      return []; // Si el archivo no existe o falla, devuelve array vacío
    }
  }

  //  Guardar todos los productos en el archivo
  async saveAll(products) {
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
  }

  //  Agregar un nuevo producto con ID único
  async addProduct(productData) {
    const products = await this.getAll();

    // Generar nuevo ID incremental
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    // Crear el nuevo producto con ID asignado
    const newProduct = { id: newId, ...productData };

    products.push(newProduct);
    await this.saveAll(products); // Guardar en archivo

    return newProduct; // Devolver el nuevo producto creado
  }

  //  Obtener un producto por su ID
  async getById(id) {
    const products = await this.getAll();
    return products.find((p) => p.id === id); // Devuelve el producto si existe
  }

  //  Actualizar un producto existente por ID
  async updateById(id, updates) {
    const products = await this.getAll();
    const product = products.find((p) => p.id === id);
    if (!product) return null; // Si no existe, devuelve null

    // Evitar que se modifique el campo ID dada la consigna del trabajo.
    if ("id" in updates) delete updates.id;

    // Lista de campos válidos que se pueden actualizar
    const validFields = [
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
    ];

    // Aplicar actualizaciones solo a campos válidos
    for (let key in updates) {
      if (validFields.includes(key)) {
        product[key] = updates[key];
      }
    }

    await this.saveAll(products); // Guardar cambios en archivo
    return product; // Devolver producto actualizado
  }

  //  Eliminar un producto por su ID
  async deleteById(id) {
    const products = await this.getAll();

    // Buscar índice del producto a eliminar
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null; // Si no lo encuentra, devuelve null

    const deleted = products.splice(index, 1)[0]; // Elimina el producto
    await this.saveAll(products); // Guarda el archivo sin ese producto

    return deleted; // Devuelve el producto eliminado
  }
}

module.exports = new ProductManager();
