-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(50),
  language ENUM('en', 'ar') DEFAULT 'en',
  dateOfBirth DATE,
  nationality VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  interests JSON,
  emailVerified DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Sessions table
CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,
  userId INT NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_expires (expiresAt)
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id VARCHAR(36) PRIMARY KEY,
  userId INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expires (expiresAt)
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
  id VARCHAR(36) PRIMARY KEY,
  userId INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiresAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expires (expiresAt)
); 