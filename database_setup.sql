-- Create Database
CREATE DATABASE IF NOT EXISTS choco_delisias;
USE choco_delisias;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    color VARCHAR(50)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert Initial Data (Categories)
INSERT INTO categories (name, image, color) VALUES
('Chocolates Artesanales', 'chocoArtesanal.png', '#8B4513'),
('Bombones Gourmet', 'bombon.png', '#A0522D'),
('Trufas Especiales', 'trufas.png', '#CD853F');

-- Insert Initial Data (Products)
-- Note: Prices are stored as decimals. The app displays them with '$'.

-- Chocolates Artesanales (Category ID 1)
INSERT INTO products (category_id, name, image, price) VALUES
(1, 'Perú 70%', 'peru.png', 12.90),
(1, 'Nibs Andinos', 'nibs.png', 14.50),
(1, 'Amargo Grazia', 'gracia.png', 11.90),
(1, 'Crocante Cacao', 'crocante.png', 13.75),
(1, 'Tradicional 60%', 'tradicional.png', 10.90),
(1, 'Choco Almendra', 'almendra.png', 15.20);

-- Bombones Gourmet (Category ID 2)
INSERT INTO products (category_id, name, image, price) VALUES
(2, 'Maracuyá', 'maracuya.png', 8.90),
(2, 'Fresa', 'fresa.png', 8.50),
(2, 'Café', 'cafe.png', 9.20),
(2, 'Avellana', 'avellana.png', 9.90),
(2, 'Caramelo', 'caramelo.png', 8.75),
(2, 'Frutos Rojos', 'frutosRojos.png', 10.50);

-- Trufas Especiales (Category ID 3)
INSERT INTO products (category_id, name, image, price) VALUES
(3, 'Trufa Dark', 'trufaDark.png', 6.90),
(3, 'Trufa Blanc', 'trufaBlanc.png', 7.50),
(3, 'Trufa Naranja', 'trufaNaranja.png', 7.20),
(3, 'Trufa Menta', 'trufaMenta.png', 6.75),
(3, 'Trufa Coco', 'trufaCoco.png', 7.90),
(3, 'Trufa Bailey', 'trufaBailey.png', 8.50);
