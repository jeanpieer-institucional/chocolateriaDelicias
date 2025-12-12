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
