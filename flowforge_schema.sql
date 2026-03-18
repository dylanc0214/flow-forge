-- flowforge_schema.sql

-- Drop database if exists and recreate
DROP DATABASE IF EXISTS flowforge;
CREATE DATABASE flowforge;
USE flowforge;

-- Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Employee', 'Manager', 'Admin') DEFAULT 'Employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflows Table
CREATE TABLE Workflows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WorkflowSteps Table
CREATE TABLE WorkflowSteps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NOT NULL,
    step_order INT NOT NULL,
    role_required ENUM('Employee', 'Manager', 'Admin') NOT NULL,
    FOREIGN KEY (workflow_id) REFERENCES Workflows(id) ON DELETE CASCADE
);

-- Requests Table
CREATE TABLE Requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) DEFAULT NULL,
    status ENUM('Pending', 'In Review', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_by INT NOT NULL,
    workflow_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (workflow_id) REFERENCES Workflows(id) ON DELETE RESTRICT
);

-- Approvals Table
CREATE TABLE Approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    approver_id INT,
    step_order INT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    comment TEXT,
    approved_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (request_id) REFERENCES Requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- Seed Data (For testing)

-- Users (Password: password123 hashed via bcrypt)
-- Using a dummy hash for seed, actual app will hash correctly. This is $2a$10$wTf/yO.zZt13K/L0D9iT.eL9w.vF88P0WcZRb5N8M68X2Q2zI7yv6 = 'password123'
INSERT INTO Users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@flowforge.com', '$2a$10$wTf/yO.zZt13K/L0D9iT.eL9w.vF88P0WcZRb5N8M68X2Q2zI7yv6', 'Admin'),
('Manager Marcus', 'manager@flowforge.com', '$2a$10$wTf/yO.zZt13K/L0D9iT.eL9w.vF88P0WcZRb5N8M68X2Q2zI7yv6', 'Manager'),
('Employee Emma', 'employee@flowforge.com', '$2a$10$wTf/yO.zZt13K/L0D9iT.eL9w.vF88P0WcZRb5N8M68X2Q2zI7yv6', 'Employee');

-- Workflows
INSERT INTO Workflows (name, description) VALUES 
('Purchase Requisition', 'Multi-level approval for office purchases'),
('Leave Request', 'Standard PTO request flow');

-- Workflow Steps (Purchase -> Manager then Admin. Leave -> Manager only)
INSERT INTO WorkflowSteps (workflow_id, step_order, role_required) VALUES 
(1, 1, 'Manager'),
(1, 2, 'Admin'),
(2, 1, 'Manager');

-- Requests
INSERT INTO Requests (title, description, amount, status, created_by, workflow_id) VALUES 
('New MacBook Pro M3', 'Need a new laptop for development work.', 2500.00, 'Pending', 3, 1),
('Annual Leave', 'Taking a week off in December.', NULL, 'Approved', 3, 2);

-- Approvals (For request 1 - Pending Manager)
INSERT INTO Approvals (request_id, approver_id, step_order, status, comment) VALUES 
(1, NULL, 1, 'Pending', NULL);

-- Approvals (For request 2 - Approved by Manager)
INSERT INTO Approvals (request_id, approver_id, step_order, status, comment, approved_at) VALUES 
(2, 2, 1, 'Approved', 'Have a good time!', CURRENT_TIMESTAMP);
