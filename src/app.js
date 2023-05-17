const express = require('express');
const ProductManager = require('./classes/ProductManager');

const app = express();
// Puerto en el que se ejecutará el servidor
const port = 8080; 

const productManager = new ProductManager('./classes/files/products.json');

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        // Obtener el valor del parámetro de consulta 'limit'
        const limit = req.query.limit; 
        // Obtener todos los productos
        const products = await productManager.getProducts();
        
        if (limit) {
        // Limitar el número de productos según el valor de 'limit'
        const limitedProducts = products.slice(0, limit); 
        res.json(limitedProducts);
        } else {
        res.json(products);
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Endpoint para obtener un producto por su ID
app.get('/products/:pid', async (req, res) => {
    try {
        // Obtener el ID del producto de los parámetros de la ruta
        const productId = parseInt(req.params.pid);
        // Obtener el producto por su ID
        const product = await productManager.getProductById(productId); 
        
        if (product) {
        res.json(product);
        } else {
        res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Endpoint para agregar un nuevo producto
app.post('/product', (req, res) => {
    const product = req.body;
    const newProduct = productManager.addProduct(product);
    res.json(newProduct);
});

// Endpoint para actualizar un producto existente
app.put('/product/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedFields = req.body;
    const updatedProduct = productManager.updateProduct(id, updatedFields);
    
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

// Endpoint para eliminar un producto
app.delete('/product/:id', (req, res) => {
    const id = parseInt(req.params.id);
    productManager.deleteProduct(id);
    res.json({ message: 'Producto eliminado' });
});

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});


/*

Iniciamos servidor en terminal: nodemon app.js

Obtener todos los productos: GET /products
Ver todos los productos: http://localhost:8080/products

Obtener todos los productos con limite máximo: GET /products?limit
Ver productos con limite de resultados 1: http://localhost:8080/products?limit=1
Ver productos con limite de resultados 2: http://localhost:8080/products?limit=2

Obtener un producto por ID: GET /product/id
Ver producto con ID=1: http://localhost:8080/products/1
Ver producto con ID=2: http://localhost:8080/products/2
Ver producto con ID=3: http://localhost:8080/products/3
Ver error por id desconocido: http://localhost:8080/products/4

Agregar un nuevo producto: POST /product
Actualizar un producto existente: PUT /product/id
Eliminar un producto: DELETE /product/id

*/