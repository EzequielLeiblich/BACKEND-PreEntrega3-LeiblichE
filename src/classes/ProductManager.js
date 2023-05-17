const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    async getProducts() {
        return this.products;
    }

    async addProduct(product) {
        const id = this.generateId();
        const newProduct = { id, ...product };
        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    generateId() {
        if (this.products.length === 0) {
        return 1;
        }
        const lastProduct = this.products[this.products.length - 1];
        return lastProduct.id + 1;
    }

    loadProducts() {
        try {
        const data = fs.readFileSync(this.path, 'utf8');
        this.products = JSON.parse(data);
        } catch (error) {
        console.error('Error al cargar productos:', error);
        }
    }

    async saveProducts() {
        try {
        const data = JSON.stringify(this.products, null, '\t');
        await fs.promises.writeFile(this.path, data, 'utf8');
        } catch (error) {
        console.error('Error al guardar productos:', error);
        }
    }

    async getProductById(id) {
        return this.products.find((product) => product.id === id);
    }

    async updateProduct(id, updatedFields) {
        const product = await this.getProductById(id);
        if (product) {
        Object.assign(product, updatedFields);
        await this.saveProducts();
        }
        return product;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
        this.products.splice(index, 1);
        await this.saveProducts();
        }
    }
}

module.exports = ProductManager;
