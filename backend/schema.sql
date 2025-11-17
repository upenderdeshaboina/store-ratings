CREATE DATABASE IF NOT EXISTS store_rating_db;

USE store_rating_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'normal_user', 'store_owner') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (user_id, store_id)
);

-- Insert sample data
INSERT INTO users (name, email, address, password, role) VALUES
('System Administrator', 'admin@example.com', 'Admin Address', '$2b$10$J.xAR6arDKZBEDjHbBL8gO1Qm2xXzpvo1N6S8wznZBiX6m1i4lcQi', 'admin'),
('Normal User Example', 'user@example.com', 'User Address', '$2b$10$NeF6yO4ZpIJ6T8mf7R/eZu6GsQzFq4pzsyVj.Nc/pqRZ3n6iPh1Yu', 'normal_user'),
('Store Owner Example', 'owner@example.com', 'Owner Address', '$2b$10$UpAruv7PzD.hoqIoxT.zDe6es/ShCmzdAvlFA6iIiNfIbDpTHbuKC', 'store_owner');


INSERT INTO stores (name, email, address) VALUES
('Store One', 'store1@example.com', 'Store Address 1'),
('Store Two', 'store2@example.com', 'Store Address 2');
