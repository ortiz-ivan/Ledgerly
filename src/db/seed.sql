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
