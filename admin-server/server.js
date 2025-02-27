const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DATA_FILE = path.join(__dirname, '../catalog-server/products.json');

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

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/products') {
        try {
            const products = await getProducts();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products));
        } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ошибка сервера' }));
        }
    } else if (req.method === 'POST' && req.url === '/products') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const newProduct = JSON.parse(body);
                const products = await getProducts();
                newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
                products.push(newProduct);
                await saveProducts(products);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newProduct));
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ошибка добавления товара' }));
            }
        });
    } else if (req.method === 'PUT' && req.url.startsWith('/products/')) {
        const id = parseInt(req.url.split('/')[2], 10);
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const updatedData = JSON.parse(body);
                const products = await getProducts();
                const index = products.findIndex(p => p.id === id);
                if (index === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Товар не найден' }));
                    return;
                }
                products[index] = { ...products[index], ...updatedData };
                await saveProducts(products);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(products[index]));
            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Ошибка обновления товара' }));
            }
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/products/')) {
        const id = parseInt(req.url.split('/')[2], 10);
        try {
            let products = await getProducts();
            const filteredProducts = products.filter(p => p.id !== id);
            if (products.length === filteredProducts.length) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Товар не найден' }));
                return;
            }
            await saveProducts(filteredProducts);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Товар удалён' }));
        } catch {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Ошибка удаления товара' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Страница не найдена');
    }
});

server.listen(PORT, () => {
    console.log(`Сервер админ-панели запущен на http://localhost:${PORT}`);
});
