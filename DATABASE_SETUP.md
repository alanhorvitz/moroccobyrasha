# Database Setup for Discover Page

This guide explains how to set up the database connection for the Discover page, replacing static data with dynamic database content.

## Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- pnpm (recommended) or npm

## Setup Steps

### 1. Database Configuration

Create a `.env` file in the root directory with the following content:

```env
# Database Configuration
DATABASE_URL="mysql://root:your_password@localhost:3306/morocco_by_rasha"

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
```

**Replace `your_password` with your actual MySQL root password.**

### 2. Database Setup

1. **Install MySQL Server** (if not already installed)
   - **Windows:** Download MySQL Installer from https://dev.mysql.com/downloads/installer/
   - **macOS:** `brew install mysql && brew services start mysql`
   - **Linux:** `sudo apt install mysql-server && sudo systemctl start mysql`

2. **Create Database**
   ```sql
   mysql -u root -p
   CREATE DATABASE morocco_by_rasha;
   EXIT;
   ```

3. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

4. **Push Database Schema**
   ```bash
   npm run db:push
   ```

5. **Seed Database with Sample Data**
   ```bash
   npm run db:seed
   ```

### 3. Start the Application

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

### 4. Verify the Setup

1. **Check API Health**
   Visit `http://localhost:3001/api/health` - should return `{"status":"OK","timestamp":"..."}`

2. **Test API Endpoints**
   - Regions: `http://localhost:3001/api/regions`
   - Attractions: `http://localhost:3001/api/attractions`
   - Festivals: `http://localhost:3001/api/festivals`
   - Cuisines: `http://localhost:3001/api/cuisines`
   - Heritage: `http://localhost:3001/api/heritages`
   - Clothing: `http://localhost:3001/api/clothing`

3. **Visit Discover Page**
   Navigate to `http://localhost:5173/discover` and verify that:
   - Data loads from the database (not static files)
   - Search and filtering work correctly
   - All tabs display content properly

## What Changed

### Backend Changes
- Added new API endpoints for Festival, Cuisine, Heritage, and Clothing models
- Updated server startup logs to include new endpoints
- Enhanced error handling and response formatting

### Frontend Changes
- Replaced static data imports with React Query API calls
- Added loading and error states
- Implemented data transformation utilities
- Updated card components to receive data as props
- Added proper TypeScript types for API responses

### Database Schema
The Prisma schema includes models for:
- **Region**: Multi-language region information with coordinates
- **Attraction**: Tourist attractions with categories and ratings
- **Festival**: Cultural events and celebrations
- **Cuisine**: Traditional Moroccan dishes with ingredients
- **Heritage**: Cultural heritage items and traditions
- **Clothing**: Traditional Moroccan attire

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL server is running
   - Check DATABASE_URL in .env file
   - Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

2. **API Endpoints Not Working**
   - Check if server is running on port 3001
   - Verify VITE_API_URL in .env file
   - Check browser console for CORS errors

3. **No Data Displayed**
   - Run the seed script: `npm run db:seed`
   - Check API responses in browser network tab
   - Verify React Query is properly configured

4. **TypeScript Errors**
   - Run `npm run db:generate` to update Prisma client
   - Restart TypeScript server in your IDE
   - Check import paths and type definitions

### Useful Commands

```bash
# Reset database
npm run db:push --force-reset

# View database in Prisma Studio
npm run db:studio

# Generate new migration
npm run db:migrate

# Check database status
npx prisma db pull
```

## Next Steps

1. **Add Real Images**: Replace placeholder image URLs with actual Moroccan tourism photos
2. **Enhance Search**: Implement full-text search with database indexing
3. **Add Pagination**: Handle large datasets with pagination
4. **User Authentication**: Add user accounts and personalized features
5. **Content Management**: Create admin interface for content management
6. **Multi-language Support**: Implement language switching based on user preferences

## API Documentation

### Regions
- `GET /api/regions` - Get all regions
- `GET /api/regions/:id` - Get specific region
- `POST /api/regions` - Create new region

### Attractions
- `GET /api/attractions` - Get all attractions
- `GET /api/attractions/:id` - Get specific attraction
- `POST /api/attractions` - Create new attraction

### Festivals
- `GET /api/festivals` - Get all festivals
- `GET /api/festivals/:id` - Get specific festival
- `POST /api/festivals` - Create new festival

### Cuisines
- `GET /api/cuisines` - Get all cuisines
- `GET /api/cuisines/:id` - Get specific cuisine
- `POST /api/cuisines` - Create new cuisine

### Heritage
- `GET /api/heritages` - Get all heritage items
- `GET /api/heritages/:id` - Get specific heritage item
- `POST /api/heritages` - Create new heritage item

### Clothing
- `GET /api/clothing` - Get all clothing items
- `GET /api/clothing/:id` - Get specific clothing item
- `POST /api/clothing` - Create new clothing item

All endpoints support proper error handling and return JSON responses with appropriate HTTP status codes. 