-- ==========================================
-- 1. Database Setup (Users, Categories, Products)
-- ==========================================

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


-- ==========================================
-- 2. Profile Picture Migration
-- ==========================================

-- Add profile_picture column to users table
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) NULL;


-- ==========================================
-- 3. Addresses Migration
-- ==========================================

-- Migration: Add addresses table for shipping addresses
CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add index for faster queries
CREATE INDEX idx_user_addresses ON addresses(user_id);
CREATE INDEX idx_default_address ON addresses(user_id, is_default);


-- ==========================================
-- 4. Orders Migration
-- ==========================================

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- ==========================================
-- 5. Cart Migration
-- ==========================================

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);


-- ==========================================
-- 6. Orders Update Migration (Address & Payment Info)
-- ==========================================

-- Migration: Update orders table to include address and payment info
ALTER TABLE orders 
ADD COLUMN address_id INT AFTER user_id,
ADD COLUMN payment_method VARCHAR(50) DEFAULT 'cash' AFTER total_amount,
ADD COLUMN shipping_cost DECIMAL(10, 2) DEFAULT 0.00 AFTER total_amount,
ADD COLUMN notes TEXT AFTER status,
ADD FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL;

-- Update existing orders to have default values
UPDATE orders SET shipping_cost = 0.00 WHERE shipping_cost IS NULL;
UPDATE orders SET payment_method = 'cash' WHERE payment_method IS NULL;


-- ==========================================
-- 7. Payments Migration (Culqi Integration)
-- ==========================================

-- Migración para agregar campos de pago a la tabla orders
ALTER TABLE orders 
ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' AFTER status,
ADD COLUMN payment_id VARCHAR(255) AFTER payment_status,
ADD COLUMN transaction_id VARCHAR(255) AFTER payment_id,
ADD COLUMN payment_error TEXT AFTER transaction_id;

-- Índice para búsquedas por payment_id
CREATE INDEX idx_payment_id ON orders(payment_id);

-- Comentarios
-- COMMENT ON COLUMN orders.payment_status IS 'Estado del pago: pending, paid, failed, refunded';
-- COMMENT ON COLUMN orders.payment_id IS 'ID del cargo en Culqi';
-- COMMENT ON COLUMN orders.transaction_id IS 'Código de referencia de la transacción';
-- COMMENT ON COLUMN orders.payment_error IS 'Mensaje de error si el pago falló';
