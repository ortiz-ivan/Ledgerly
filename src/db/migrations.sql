-- TABLA: categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

-- TABLA: transacciones
CREATE TABLE IF NOT EXISTS transacciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL CHECK (tipo IN ('INGRESO', 'EGRESO')),
    monto REAL NOT NULL CHECK (monto > 0),
    descripcion TEXT,
    fecha DATE NOT NULL,
    categoria_id INTEGER,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE SET NULL
);

-- ÍNDICES (rendimiento y análisis)
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha
ON transacciones(fecha);

CREATE INDEX IF NOT EXISTS idx_transacciones_tipo
ON transacciones(tipo);

CREATE INDEX IF NOT EXISTS idx_transacciones_categoria
ON transacciones(categoria_id);
