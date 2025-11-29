-- Crear la base de datos (si no existe) y usarla
CREATE DATABASE IF NOT EXISTS securitydb;
USE securitydb;

-- Crear tabla users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);


