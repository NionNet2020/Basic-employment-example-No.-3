# Basic-employment-example-No.-3

## 🚀 Описание проекта
Этот проект включает в себя два сервера:
- **Магазин (`shop-server`)** - возвращает список товаров из `JSON`-файла.
- **Админ-панель (`admin-server`)** - позволяет добавлять, редактировать и удалять товары через API.

## 📌 Установка и запуск
### 1️⃣ Установка зависимостей
```sh
npm install
```

### 2️⃣ Запуск серверов
Запускаем **магазин** (порт `3000`):
```sh
node shop-server/server.js
```
Запускаем **админ-панель** (порт `8080`):
```sh
node admin-server/server.js
```

## 📡 API-запросы

### 🔹 1. Получение списка товаров (`GET /products`)
**Браузер:**
```
http://localhost:8080/products
```
**fetch:**
```javascript
fetch('http://localhost:8080/products')
  .then(res => res.json())
  .then(data => console.log(data));
```

---
### 🔹 2. Получение товара по ID (`GET /products/:id`)
**Браузер:**
```
http://localhost:8080/products/1
```
**fetch:**
```javascript
fetch('http://localhost:8080/products/1')
  .then(res => res.json())
  .then(data => console.log(data));
```

---
### 🔹 3. Добавление товара (`POST /products`)
```javascript
fetch('http://localhost:8080/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "Игровая мышь",
        price: 3500,
        description: "RGB-подсветка, 6 кнопок",
        categories: ["Аксессуары"]
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

---
### 🔹 4. Изменение товара (`PUT /products/:id`)
```javascript
fetch('http://localhost:8080/products/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        price: 4000,
        description: "Обновленный дизайн с RGB-подсветкой"
    })
})
.then(res => res.json())
.then(data => console.log(data));
```

---
### 🔹 5. Удаление товара (`DELETE /products/:id`)
```javascript
fetch('http://localhost:8080/products/1', {
    method: 'DELETE'
})
.then(res => res.json())
.then(data => console.log(data));
```

---
## 🛠 Возможные ошибки
- `404 Not Found` – товар не найден
- `400 Bad Request` – ошибка в теле запроса
- `500 Internal Server Error` – ошибка на сервере

✅ **Теперь ты можешь легко тестировать API прямо из браузера!** 🚀

