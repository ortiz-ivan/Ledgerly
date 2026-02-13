-- INSERTAR CATEGORÍAS DE INGRESOS
INSERT OR IGNORE INTO categorias (nombre, descripcion) VALUES 
('Salario', 'Ingreso por sueldo regular'),
('Extra', 'Ingresos adicionales/bonificación'),
('Freelance', 'Trabajos por cuenta propia'),
('Inversiones', 'Rendimientos de inversiones'),
('Otro Ingreso', 'Otros ingresos varios');

-- INSERTAR CATEGORÍAS DE EGRESOS
INSERT OR IGNORE INTO categorias (nombre, descripcion) VALUES 
('Alimentación', 'Comida, bebidas, groceries'),
('Transporte', 'Gasolina, uber, transporte público'),
('Vivienda', 'Alquiler, servicios (agua, luz, gas)'),
('Salud', 'Medicinas, doctor, farmacia'),
('Entretenimiento', 'Cine, música, hobbies'),
('Educación', 'Cursos, libros, formación'),
('Compras', 'Ropa, electrónica, artículos'),
('Deudas', 'Pagos de deudas/créditos'),
('Otro Egreso', 'Otros gastos varios');

-- INSERTAR TRANSACCIONES DE PRUEBA (usando fechas dinámicas)
INSERT OR IGNORE INTO transacciones (tipo, monto, descripcion, fecha, categoria_id) VALUES
-- Transacciones del mes actual
('INGRESO', 2500000, 'Salario mensual', DATE('now', 'start of month'), 1),
('INGRESO', 150000, 'Bonus extra', DATE('now', 'start of month', '+9 days'), 2),
('EGRESO', 250000, 'Supermercado', DATE('now', 'start of month', '+2 days'), 7),
('EGRESO', 80000, 'Gasolina', DATE('now', 'start of month', '+4 days'), 8),
('EGRESO', 450000, 'Alquiler', DATE('now', 'start of month', '+6 days'), 9),
('EGRESO', 120000, 'Cine y entretenimiento', DATE('now', 'start of month', '+11 days'), 11),
('EGRESO', 45000, 'Farmacia', DATE('now', 'start of month', '+14 days'), 10),

-- Transacciones del mes anterior
('INGRESO', 2500000, 'Salario mensual', DATE('now', 'start of month', '-1 month'), 1),
('EGRESO', 280000, 'Compras electrodomésticos', DATE('now', 'start of month', '-1 month', '+9 days'), 12),
('EGRESO', 450000, 'Alquiler', DATE('now', 'start of month', '-1 month', '+6 days'), 9),
('EGRESO', 200000, 'Groceries', DATE('now', 'start of month', '-1 month', '+14 days'), 7);

