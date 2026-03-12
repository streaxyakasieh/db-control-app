DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS sales;

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price INTEGER NOT NULL
);

CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    sale_date TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (title, price) VALUES
('Surface Laptop', 145000),
('Office 365 License', 12000),
('Azure Subscription', 50000);

INSERT INTO sales (product_id, quantity, sale_date) VALUES
(1, 3, '2026-01-12'),
(2, 12, '2026-01-15'),
(3, 5, '2026-02-01');