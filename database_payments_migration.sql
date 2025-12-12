-- Migración para agregar campos de pago a la tabla orders

ALTER TABLE orders 
ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending' AFTER status,
ADD COLUMN payment_id VARCHAR(255) AFTER payment_status,
ADD COLUMN transaction_id VARCHAR(255) AFTER payment_id,
ADD COLUMN payment_error TEXT AFTER transaction_id;

-- Índice para búsquedas por payment_id
CREATE INDEX idx_payment_id ON orders(payment_id);

-- Comentarios
COMMENT ON COLUMN orders.payment_status IS 'Estado del pago: pending, paid, failed, refunded';
COMMENT ON COLUMN orders.payment_id IS 'ID del cargo en Culqi';
COMMENT ON COLUMN orders.transaction_id IS 'Código de referencia de la transacción';
COMMENT ON COLUMN orders.payment_error IS 'Mensaje de error si el pago falló';
