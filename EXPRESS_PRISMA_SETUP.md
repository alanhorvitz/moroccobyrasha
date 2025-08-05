# Express.js and Prisma Integration Setup

This guide explains how to set up and run the Express.js backend with Prisma database integration using MySQL.

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- pnpm (recommended) or npm

## Installation

The following dependencies have been added to your project:

### Backend Dependencies
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `dotenv` - Environment variables
- `@prisma/client` - Prisma client
- `prisma` - Prisma CLI
- `mysql2` - MySQL driver for Prisma

### Development Dependencies
- `@types/express` - TypeScript types for Express
- `@types/cors` - TypeScript types for CORS
- `@types/morgan` - TypeScript types for Morgan

## Database Setup

### 1. Install MySQL Server

**Windows:**
- Download MySQL Installer from https://dev.mysql.com/downloads/installer/
- Run the installer and follow the setup wizard
- Remember the root password you set

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 2. Create Database

Connect to MySQL and create the database:
```sql
mysql -u root -p
CREATE DATABASE morocco_by_rasha;
EXIT;
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/morocco_by_rasha"
PORT=3001
NODE_ENV=development
```

**Replace `your_password` with your actual MySQL root password.**

### 4. Database Migration

1. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

2. **Push Database Schema**
   ```bash
   npm run db:push
   ```

3. **Seed Database (Optional)**
   ```bash
   npm run db:seed
   ```

## Running the Application

### Development Mode

1. **Start the Express Server**
   ```bash
   npm run dev:server
   ```
   The server will run on `http://localhost:3001`

2. **Start the React Frontend**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the Server**
   ```bash
   npm run build:server
   ```

2. **Start the Server**
   ```bash
   npm run start:server
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

## Database Schema

The Prisma schema includes two main models:

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}
```

### Post Model
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Frontend Integration

The frontend includes:

1. **API Service** (`src/lib/api.ts`) - Functions to communicate with the Express server
2. **Demo Component** (`src/components/ApiDemo.tsx`) - Example component showing API usage
3. **Prisma Client** (`src/lib/prisma.ts`) - Prisma client utility

## Troubleshooting

### MySQL Connection Issues
- Ensure MySQL server is running
- Verify the database exists: `mysql -u root -p -e "SHOW DATABASES;"`
- Check your password in the `.env` file
- Test connection: `mysql -u root -p morocco_by_rasha`

### PowerShell Execution Policy
If you encounter PowerShell execution policy errors, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Database Issues
- Ensure the `.env` file exists with the correct `DATABASE_URL`
- Run `npm run db:generate` after schema changes
- Use `npm run db:studio` to view and edit data in Prisma Studio

### Port Conflicts
- Change the `PORT` in `.env` if port 3001 is already in use
- Update the `VITE_API_URL` in your frontend environment if needed

## Next Steps

1. Add authentication middleware
2. Implement input validation with Zod
3. Add error handling middleware
4. Set up database migrations
5. Add API rate limiting
6. Implement caching strategies
7. Set up database backups 