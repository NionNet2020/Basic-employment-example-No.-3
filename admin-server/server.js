const http = require('http');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const express = require('express');

const PORT = 8080;
const DATA_FILE = path.join(__dirname, '../catalog-server/products.json');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const getProducts = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(DATA_FILE, (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
};

const saveProducts = (products) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

app.get('/products', async (req, res) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const products = await getProducts();
        newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
        products.push(newProduct);
        await saveProducts(products);
        res.status(201).json(newProduct);
    } catch {
        res.status(400).json({ error: 'Ошибка добавления товара' });
    }
});

app.put('/products/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        const updatedData = req.body;
        const products = await getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return res.status(404).json({ error: 'Товар не найден' });
        products[index] = { ...products[index], ...updatedData };
        await saveProducts(products);
        res.json(products[index]);
    } catch {
        res.status(400).json({ error: 'Ошибка обновления товара' });
    }
});

app.delete('/products/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    try {
        let products = await getProducts();
        const filteredProducts = products.filter(p => p.id !== id);
        if (products.length === filteredProducts.length) return res.status(404).json({ error: 'Товар не найден' });
        await saveProducts(filteredProducts);
        res.json({ message: 'Товар удалён' });
    } catch {
        res.status(500).json({ error: 'Ошибка удаления товара' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер админ-панели запущен на http://localhost:${PORT}`);
    console.log(`Документация доступна на http://localhost:${PORT}/api-docs`);
});

