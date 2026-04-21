CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

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

-- Roles
INSERT INTO roles (nombre, descripcion) VALUES
    ('SuperAdmin', 'Acceso total al sistema'),
    ('Auditor', 'Solo lectura en usuarios y productos'),
    ('Registrador', 'CRUD de productos, lectura de usuarios')
ON CONFLICT (nombre) DO NOTHING;

-- Usuarios
-- Todos tienen password: Admin1234!
INSERT INTO users (username, email, password_hash, role_id) VALUES
    ('superadmin',
     'superadmin@sistema.com',
     '$2a$12$NMeqtkvaCOghpK1TTQGsT.L8T/3Igl3UpvKESTnlk/cl83GnIWjM.',
     (SELECT id FROM roles WHERE nombre = 'SuperAdmin')),

    ('auditora',
     'auditora@sistema.com',
     '$2a$12$NMeqtkvaCOghpK1TTQGsT.L8T/3Igl3UpvKESTnlk/cl83GnIWjM.',
     (SELECT id FROM roles WHERE nombre = 'Auditor')),

    ('registrador1',
     'registrador1@sistema.com',
     '$2a$12$NMeqtkvaCOghpK1TTQGsT.L8T/3Igl3UpvKESTnlk/cl83GnIWjM.',
     (SELECT id FROM roles WHERE nombre = 'Registrador')),

    ('registrador2',
     'registrador2@sistema.com',
     '$2a$12$NMeqtkvaCOghpK1TTQGsT.L8T/3Igl3UpvKESTnlk/cl83GnIWjM.',
     (SELECT id FROM roles WHERE nombre = 'Registrador')),

    ('auditor2',
     'auditor2@sistema.com',
     '$2a$12$NMeqtkvaCOghpK1TTQGsT.L8T/3Igl3UpvKESTnlk/cl83GnIWjM.',
     (SELECT id FROM roles WHERE nombre = 'Auditor'))
ON CONFLICT (username) DO NOTHING;

-- Productos
INSERT INTO products (codigo, nombre, descripcion, cantidad, precio) VALUES
    ('LAPTOP-001', 'Laptop Dell Inspiron 15',
     'Procesador Intel Core i5 de 12va generación, 8GB RAM, SSD 256GB, pantalla 15.6"',
     15, 899.99),

    ('LAPTOP-002', 'Laptop HP Pavilion 14',
     'AMD Ryzen 5, 16GB RAM, SSD 512GB, pantalla Full HD 14"',
     8, 749.99),

    ('LAPTOP-003', 'MacBook Air M2',
     'Chip Apple M2, 8GB RAM unificada, SSD 256GB, pantalla Liquid Retina 13.6"',
     5, 1199.99),

    ('MOUSE-001', 'Mouse Logitech MX Master 3',
     'Mouse inalámbrico ergonómico, sensor 8K DPI, compatible Windows y macOS',
     42, 99.99),

    ('MOUSE-002', 'Mouse Razer DeathAdder V3',
     'Mouse gaming con cable, sensor Focus Pro 30K, 90 horas de batería',
     30, 79.99),

    ('TECLADO-001', 'Teclado Mecánico Keychron K2',
     'Teclado compacto 75%, switches Brown, compatible Mac y Windows, retroiluminación RGB',
     20, 89.99),

    ('TECLADO-002', 'Teclado Logitech MX Keys',
     'Teclado inalámbrico retroiluminado, teclas esféricas, carga USB-C',
     25, 109.99),

    ('MONITOR-001', 'Monitor LG 27" 4K',
     'Panel IPS 4K UHD, 60Hz, HDR400, conectividad HDMI y DisplayPort',
     10, 349.99),

    ('MONITOR-002', 'Monitor Samsung 24" FHD',
     'Panel IPS Full HD, 75Hz, FreeSync, marco ultradelgado',
     18, 199.99),

    ('AURICULAR-001', 'Auriculares Sony WH-1000XM5',
     'Cancelación de ruido líder de la industria, 30 horas de batería, carga rápida',
     12, 349.99),

    ('AURICULAR-002', 'Auriculares Jabra Evolve2 55',
     'Cancelación de ruido profesional, certificado para Microsoft Teams, Bluetooth 5.0',
     7, 299.99),

    ('WEBCAM-001', 'Webcam Logitech C920 HD Pro',
     'Resolución Full HD 1080p, 30fps, corrección de luz automática, micrófono estéreo',
     22, 79.99),

    ('WEBCAM-002', 'Webcam Razer Kiyo Pro',
     'Sensor CMOS 1/2.8", HDR adaptativo, campo de visión ajustable 103°/90°/80°',
     9, 129.99),

    ('HUB-001', 'Hub USB-C Anker 7 en 1',
     'HDMI 4K, 3x USB-A 3.0, SD/microSD, USB-C PD 100W',
     35, 49.99),

    ('SSD-001', 'SSD Externo Samsung T7 1TB',
     'USB 3.2 Gen 2, velocidad lectura 1050 MB/s, cifrado por hardware AES 256-bit',
     14, 109.99),

    ('SSD-002', 'SSD Interno WD Blue 500GB',
     'Factor de forma 2.5", interfaz SATA III, velocidad lectura 560 MB/s',
     20, 59.99),

    ('RAM-001', 'Memoria RAM Corsair 16GB DDR4',
     'Kit 2x8GB, 3200MHz, CL16, compatible Intel y AMD',
     28, 49.99),

    ('IMPRESORA-001', 'Impresora HP LaserJet Pro M404dn',
     'Impresión láser monocromática, 38 ppm, dúplex automático, Ethernet',
     6, 299.99),

    ('TABLET-001', 'iPad 10ma Generación',
     'Chip A14 Bionic, pantalla Liquid Retina 10.9", Wi-Fi 6, USB-C, 64GB',
     11, 449.99),

    ('CABLES-001', 'Cable USB-C a USB-C 2m Anker',
     'Carga rápida 100W, transferencia datos USB 3.1, trenzado nylon resistente',
     60, 19.99)
ON CONFLICT (codigo) DO NOTHING;

-- Logs de auditoría de ejemplo
INSERT INTO audit_log (usuario_id, username, accion, entidad, detalle, ip, resultado) VALUES
    (1, 'superadmin', 'LOGIN_EXITOSO', NULL, NULL, '192.168.1.10', 'OK'),
    (1, 'superadmin', 'CREAR_USUARIO', 'users', 'Usuario creado: auditora', '192.168.1.10', 'OK'),
    (1, 'superadmin', 'CREAR_USUARIO', 'users', 'Usuario creado: registrador1', '192.168.1.10', 'OK'),
    (2, 'auditora', 'LOGIN_EXITOSO', NULL, NULL, '192.168.1.11', 'OK'),
    (2, 'auditora', 'ACCESO_DENEGADO', 'products', 'Permiso requerido: CRUD_PRODUCTOS | Ruta: POST /api/products', '192.168.1.11', 'DENEGADO'),
    (3, 'registrador1', 'LOGIN_EXITOSO', NULL, NULL, '192.168.1.12', 'OK'),
    (3, 'registrador1', 'CREAR_PRODUCTO', 'products', 'Producto creado: Laptop Dell Inspiron 15', '192.168.1.12', 'OK'),
    (3, 'registrador1', 'CREAR_PRODUCTO', 'products', 'Producto creado: Mouse Logitech MX Master 3', '192.168.1.12', 'OK'),
    (NULL, 'hackerint3nt0', 'LOGIN_FALLIDO', NULL, 'Usuario no encontrado', '45.33.32.156', 'FALLIDO'),
    (NULL, 'hackerint3nt0', 'LOGIN_FALLIDO', NULL, 'Usuario no encontrado', '45.33.32.156', 'FALLIDO'),
    (NULL, 'hackerint3nt0', 'LOGIN_FALLIDO', NULL, 'Usuario no encontrado', '45.33.32.156', 'FALLIDO'),
    (NULL, 'hackerint3nt0', 'LOGIN_BLOQUEADO', NULL, 'IP bloqueada por exceder intentos fallidos', '45.33.32.156', 'BLOQUEADO'),
    (1, 'superadmin', 'EDITAR_USUARIO', 'users', 'Usuario editado: auditora (cambio de rol)', '192.168.1.10', 'OK'),
    (3, 'registrador1', 'EDITAR_PRODUCTO', 'products', 'Producto editado: Laptop Dell Inspiron 15', '192.168.1.12', 'OK'),
    (1, 'superadmin', 'LOGOUT', NULL, NULL, '192.168.1.10', 'OK')
ON CONFLICT DO NOTHING;