-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    ultimo_login TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(50),
    accion VARCHAR(100) NOT NULL,
    entidad VARCHAR(50),
    entidad_id INTEGER,
    detalle TEXT,
    ip VARCHAR(45),
    resultado VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed: roles
INSERT INTO roles (nombre, descripcion) VALUES
    ('SuperAdmin', 'Acceso total al sistema'),
    ('Auditor', 'Solo lectura en usuarios y productos'),
    ('Registrador', 'CRUD de productos, lectura de usuarios')
ON CONFLICT (nombre) DO NOTHING;

-- Seed: usuario superadmin
-- Contraseña: Admin1234! (bcrypt cost=12)
INSERT INTO users (username, email, password_hash, role_id) VALUES (
    'superadmin',
    'superadmin@sistema.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeAiZ3jL6Y4zOmFPu',
    (SELECT id FROM roles WHERE nombre = 'SuperAdmin')
) ON CONFLICT (username) DO NOTHING;