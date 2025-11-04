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

INSERT INTO users (username, password, role) VALUES
('john.doe@example.com', 'Jd@2025!Secure', 'ADMIN'),
('jane.smith@example.com', 'Js#Lib2025$', 'USER'),
('carlos.rod@example.com', 'Cr@Strong#2025', 'USER'),
('maria.lopez@example.com', 'Ml@Safe2025$', 'USER'),
('laura.torres@example.com', 'Lt@User2025!', 'USER');


Select * from users;

TRUNCATE TABLE users;

