CREATE DATABASE IF NOT EXISTS securitydb;

USE securitydb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

INSERT INTO users (username, password, role) 
VALUES ('testuser', 'hashedpassword', 'USER');


