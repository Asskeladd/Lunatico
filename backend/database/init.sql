-- Database initialization script for Taller Zambrano
-- Run this script to create the database and seed initial data

CREATE DATABASE IF NOT EXISTS taller_zambrano;
USE taller_zambrano;

-- Users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(200) NOT NULL,
    role ENUM('admin', 'operator') DEFAULT 'operator',
    avatar LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    client VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    assigned_to VARCHAR(100),
    quantity INT NOT NULL,
    deadline DATE,
    priority ENUM('Alta', 'Media', 'Baja') DEFAULT 'Media',
    status ENUM('Pendiente', 'En Progreso', 'Completada', 'Retrasada') DEFAULT 'Pendiente',
    progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Machines table
DROP TABLE IF EXISTS machines;
CREATE TABLE machines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    status ENUM('Operando', 'Inactivo', 'Mantenimiento', 'Detenido') DEFAULT 'Inactivo',
    operator VARCHAR(200),
    current_job VARCHAR(50),
    efficiency INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reports productivity table
DROP TABLE IF EXISTS reports_productivity;
CREATE TABLE reports_productivity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day VARCHAR(10) NOT NULL,
    value INT NOT NULL
);

-- ===========================================
-- SEED DATA
-- ===========================================

-- Insert default users (password: 123 - hashed with bcrypt)
-- $2a$10$N9qo8uLOickgx2ZMRZoMye is the hash of "123"
INSERT INTO users (id, username, password, name, role) VALUES
('u1', 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5NSZhHU.nblxLVlKqWVLHhHnU0qHO', 'Juan Admin', 'admin'),
('u2', 'operator', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIH5NSZhHU.nblxLVlKqWVLHhHnU0qHO', 'Carlos Operador', 'operator');

-- Insert sample orders
INSERT INTO orders (id, client, description, assigned_to, quantity, deadline, status, priority, progress) VALUES
('ORD-001', 'Industrias A', 'Eje Principal', 'operator', 50, '2026-02-10', 'En Progreso', 'Alta', 65),
('ORD-002', 'Metalmecánica B', 'Buje de Bronce', NULL, 200, '2026-02-15', 'Pendiente', 'Media', 0),
('ORD-003', 'AgroParts', 'Engranaje Cónico', 'operator', 20, '2026-02-05', 'Completada', 'Baja', 100),
('ORD-004', 'AutoFix', 'Disco de Freno', 'operator', 10, '2026-01-20', 'Retrasada', 'Alta', 80);

-- Insert sample machines
INSERT INTO machines (id, name, status, operator, current_job, efficiency) VALUES
('M-01', 'Torno CNC 1', 'Operando', 'Luis G.', 'ORD-001', 92),
('M-02', 'Torno Convencional A', 'Inactivo', 'Ana M.', NULL, 0),
('M-03', 'Torno Convencional B', 'Mantenimiento', NULL, NULL, 0),
('M-04', 'Fresadora 1', 'Operando', 'Carlos R.', 'ORD-002', 88),
('M-05', 'Taladro Radial', 'Detenido', NULL, NULL, 0);

-- Insert sample productivity data
INSERT INTO reports_productivity (day, value) VALUES
('Lun', 85),
('Mar', 92),
('Mié', 78),
('Jue', 88),
('Vie', 95);
