-- =============================================
-- TALLER ZAMBRANO - Schema Completo según MER
-- =============================================

DROP DATABASE IF EXISTS taller_zambrano;
CREATE DATABASE taller_zambrano CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taller_zambrano;

-- =============================================
-- TABLA: clientes
-- =============================================
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABLA: materiales
-- =============================================
CREATE TABLE materiales (
    id_material INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    unidad VARCHAR(20) NOT NULL,
    stock_actual INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABLA: operarios (usuarios)
-- =============================================
CREATE TABLE operarios (
    id_operario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    especialidad VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    role ENUM('admin', 'operator') DEFAULT 'operator',
    avatar LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABLA: maquinas
-- =============================================
CREATE TABLE maquinas (
    id_maquina INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'Inactivo',
    operator VARCHAR(50),
    currentJob VARCHAR(100),
    efficiency INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- TABLA: ordenes_trabajo
-- =============================================
CREATE TABLE ordenes_trabajo (
    id_orden INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    tipo_pieza VARCHAR(100),
    cantidad INT NOT NULL,
    fecha_entrega DATE,
    fecha_recepcion DATE,
    prioridad ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
    estado VARCHAR(20) DEFAULT 'Pendiente',
    description TEXT,
    progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- TABLA: ordenes_materiales (N:N)
-- =============================================
CREATE TABLE ordenes_materiales (
    id_orden_material INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_material INT NOT NULL,
    cantidad_utilizada INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_orden) REFERENCES ordenes_trabajo(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- TABLA: seguimiento_diario
-- =============================================
CREATE TABLE seguimiento_diario (
    id_seguimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    fecha DATE NOT NULL,
    horas_trabajadas DECIMAL(4,2),
    etapa_completada VARCHAR(100),
    incidencias TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_orden) REFERENCES ordenes_trabajo(id_orden) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- TABLA: asignaciones_recursos
-- =============================================
CREATE TABLE asignaciones_recursos (
    id_asignacion INT PRIMARY KEY AUTO_INCREMENT,
    id_orden INT NOT NULL,
    id_maquina INT,
    id_operario INT,
    fecha_asignacion DATE NOT NULL,
    turno VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_orden) REFERENCES ordenes_trabajo(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id_maquina) ON DELETE SET NULL,
    FOREIGN KEY (id_operario) REFERENCES operarios(id_operario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================
-- TABLA: reportes_mensuales
-- =============================================
CREATE TABLE reportes_mensuales (
    id_reporte INT PRIMARY KEY AUTO_INCREMENT,
    mes VARCHAR(10) NOT NULL,
    anio INT NOT NULL,
    total_piezas INT DEFAULT 0,
    total_horas DECIMAL(8,2) DEFAULT 0,
    total_materiales_utilizados INT DEFAULT 0,
    fecha_generacion DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- DATOS DE PRUEBA
-- =============================================

-- Operarios con contraseña hasheada (bcrypt hash de "123")
INSERT INTO operarios (nombre, username, password, especialidad, activo, role) VALUES
('Administrador', 'admin', '$2a$10$YourBcryptHashHere', 'Gestión', TRUE, 'admin'),
('Juan Pérez', 'operator', '$2a$10$YourBcryptHashHere', 'Torneado', TRUE, 'operator'),
('María González', 'maria', '$2a$10$YourBcryptHashHere', 'Fresado', TRUE, 'operator');

-- Clientes
INSERT INTO clientes (nombre, telefono, email) VALUES
('Empresa ABC S.A.', '555-0101', 'contacto@abc.com'),
('Industrias XYZ', '555-0102', 'ventas@xyz.com'),
('Metalúrgica DEF', '555-0103', 'info@def.com');

-- Materiales
INSERT INTO materiales (nombre, unidad, stock_actual) VALUES
('Acero AISI 1045', 'kg', 500),
('Aluminio 6061', 'kg', 300),
('Bronce', 'kg', 150),
('Aceite de corte', 'litros', 50);

-- Máquinas
INSERT INTO maquinas (nombre, tipo, estado) VALUES
('Torno CNC 1', 'CNC', 'Operando'),
('Torno Manual 1', 'Manual', 'Inactivo'),
('Fresadora Universal', 'Universal', 'Mantenimiento'),
('Rectificadora', 'Plana', 'Operando'),
('Taladradora', 'Columna', 'Inactivo');

-- Órdenes de trabajo
INSERT INTO ordenes_trabajo (id_cliente, tipo_pieza, cantidad, fecha_entrega, fecha_recepcion, prioridad, estado, description) VALUES
(1, 'Eje de transmisión', 50, '2024-02-15', '2024-02-01', 'Alta', 'En Progreso', 'Eje D=50mm, L=200mm'),
(2, 'Piñón cónico', 100, '2024-02-20', '2024-02-05', 'Media', 'Pendiente', 'Módulo 3, Z=24'),
(3, 'Soporte angular', 25, '2024-02-10', '2024-01-28', 'Alta', 'Completada', 'Soporte en L, acero');

-- Órdenes - Materiales
INSERT INTO ordenes_materiales (id_orden, id_material, cantidad_utilizada) VALUES
(1, 1, 25),  -- Orden 1 usa 25kg de Acero
(1, 4, 2),   -- Orden 1 usa 2L de aceite
(2, 1, 30),
(3, 2, 10);  -- Orden 3 usa 10kg de Aluminio

-- Seguimiento diario
INSERT INTO seguimiento_diario (id_orden, fecha, horas_trabajadas, etapa_completada, incidencias) VALUES
(1, '2024-02-02', 8.0, 'Torneado inicial', NULL),
(1, '2024-02-03', 7.5, 'Acabado superficial', 'Rotura de herramienta'),
(3, '2024-01-29', 6.0, 'Finalizado', NULL);

-- Asignaciones de recursos
INSERT INTO asignaciones_recursos (id_orden, id_maquina, id_operario, fecha_asignacion, turno) VALUES
(1, 1, 2, '2024-02-02', 'Mañana'),
(2, 2, 3, '2024-02-05', 'Tarde'),
(3, 4, 2, '2024-01-29', 'Mañana');

-- Reportes mensuales
INSERT INTO reportes_mensuales (mes, anio, total_piezas, total_horas, total_materiales_utilizados, fecha_generacion) VALUES
('Enero', 2024, 175, 320.5, 450, '2024-02-01'),
('Febrero', 2024, 0, 0, 0, '2024-03-01');
