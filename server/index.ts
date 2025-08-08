import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});


// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(morgan('combined'));
// Increase body size limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// File upload endpoint
app.post('/api/upload', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = (req.files as Express.Multer.File[]).map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({ 
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Error uploading files' });
  }
}, (error: any, req: any, res: any, next: any) => {
  // Handle multer errors
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 10 files.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Unexpected file field.' });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ error: 'Only image files are allowed.' });
  }
  
  console.error('Upload error:', error);
  res.status(500).json({ error: 'Error uploading files' });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Regions API routes
app.get('/api/regions', async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        attractions: true,
        mediaItems: true,
        contentItems: true,
      },
    });
    res.json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/regions', async (req, res) => {
  try {
    const { 
      name_en, name_ar, name_fr, name_it, name_es,
      description_en, description_ar, description_fr, description_it, description_es,
      climate_en, climate_ar, climate_fr, climate_it, climate_es,
      bestTimeToVisit_en, bestTimeToVisit_ar, bestTimeToVisit_fr, bestTimeToVisit_it, bestTimeToVisit_es,
      keyFacts_en, keyFacts_ar, keyFacts_fr, keyFacts_it, keyFacts_es,
      latitude, longitude, imageUrls 
    } = req.body;
    
    const region = await prisma.region.create({
      data: {
        name_en, name_ar, name_fr, name_it, name_es,
        description_en, description_ar, description_fr, description_it, description_es,
        climate_en, climate_ar, climate_fr, climate_it, climate_es,
        bestTimeToVisit_en, bestTimeToVisit_ar, bestTimeToVisit_fr, bestTimeToVisit_it, bestTimeToVisit_es,
        keyFacts_en, keyFacts_ar, keyFacts_fr, keyFacts_it, keyFacts_es,
        latitude, longitude, imageUrls,
      },
    });
    res.status(201).json(region);
  } catch (error) {
    console.error('Error creating region:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) region
app.put('/api/regions/:id', async (req, res) => {
  try {
    const region = await prisma.region.update({ where: { id: req.params.id }, data: req.body });
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// DELETE region
app.delete('/api/regions/:id', async (req, res) => {
  try {
    await prisma.region.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Attractions API routes
app.get('/api/attractions', async (req, res) => {
  try {
    const attractions = await prisma.attraction.findMany({
      include: {
        region: true,
        reviews: true,
      },
    });
    res.json(attractions);
  } catch (error) {
    console.error('Error fetching attractions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/attractions', async (req, res) => {
  try {
    const { 
      name_en, name_ar, name_fr, name_it, name_es,
      description_en, description_ar, description_fr, description_it, description_es,
      category_en, category_ar, category_fr, category_it, category_es,
      regionId, latitude, longitude, imageUrls, rating, tags, entryFee, currency, openingHours 
    } = req.body;
    
    const attraction = await prisma.attraction.create({
      data: {
        name_en, name_ar, name_fr, name_it, name_es,
        description_en, description_ar, description_fr, description_it, description_es,
        category_en, category_ar, category_fr, category_it, category_es,
        regionId, latitude, longitude, imageUrls, rating, tags, entryFee, currency, openingHours,
      },
      include: {
        region: true,
      },
    });
    res.status(201).json(attraction);
  } catch (error) {
    console.error('Error creating attraction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) attraction
app.put('/api/attractions/:id', async (req, res) => {
  try {
    const attraction = await prisma.attraction.update({ where: { id: req.params.id }, data: req.body });
    res.json(attraction);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// DELETE attraction
app.delete('/api/attractions/:id', async (req, res) => {
  try {
    await prisma.attraction.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tour Packages API routes
app.get('/api/tour-packages', async (req, res) => {
  try {
    const tourPackages = await prisma.tourPackage.findMany({
      include: {
        regions: {
          include: {
            region: true,
          },
        },
        itinerary: {
          include: {
            days: {
              include: {
                accommodation: true,
                meals: true,
              },
            },
          },
        },
        reviews: true,
      },
    });
    res.json(tourPackages);
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tour-packages', async (req, res) => {
  try {
    const { 
      title_en, title_ar, title_fr, title_it, title_es,
      description_en, description_ar, description_fr, description_it, description_es,
      difficulty_en, difficulty_ar, difficulty_fr, difficulty_it, difficulty_es,
      duration, price, currency, imageUrls, included, excluded 
    } = req.body;
    
    const tourPackage = await prisma.tourPackage.create({
      data: {
        title_en, title_ar, title_fr, title_it, title_es,
        description_en, description_ar, description_fr, description_it, description_es,
        difficulty_en, difficulty_ar, difficulty_fr, difficulty_it, difficulty_es,
        duration, price, currency, imageUrls, included, excluded,
      },
    });
    res.status(201).json(tourPackage);
  } catch (error) {
    console.error('Error creating tour package:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Guides API routes
app.get('/api/guides', async (req, res) => {
  try {
    const guides = await prisma.guide.findMany({
      include: {
        regions: {
          include: {
            region: true,
          },
        },
        reviews: true,
      },
    });
    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/guides', async (req, res) => {
  try {
    const { 
      name_en, name_ar, name_fr, name_it, name_es,
      description_en, description_ar, description_fr, description_it, description_es,
      languages, specialties, certifications, yearsOfExperience, imageUrls, hourlyRate, currency, email, phone, website, availability 
    } = req.body;
    
    const guide = await prisma.guide.create({
      data: {
        name_en, name_ar, name_fr, name_it, name_es,
        description_en, description_ar, description_fr, description_it, description_es,
        languages, specialties, certifications, yearsOfExperience, imageUrls, hourlyRate, currency, email, phone, website, availability,
      },
    });
    res.status(201).json(guide);
  } catch (error) {
    console.error('Error creating guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Media Items API routes
app.get('/api/media', async (req, res) => {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      include: {
        region: true,
      },
    });
    res.json(mediaItems);
  } catch (error) {
    console.error('Error fetching media items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/media', async (req, res) => {
  try {
    const { 
      title_en, title_ar, title_fr, title_it, title_es,
      description_en, description_ar, description_fr, description_it, description_es,
      type, url, thumbnailUrl, tags, regionId, categoryId, photographer, latitude, longitude, isFeatured 
    } = req.body;
    
    const mediaItem = await prisma.mediaItem.create({
      data: {
        title_en, title_ar, title_fr, title_it, title_es,
        description_en, description_ar, description_fr, description_it, description_es,
        type, url, thumbnailUrl, tags, regionId, categoryId, photographer, latitude, longitude, isFeatured,
      },
      include: {
        region: true,
      },
    });
    res.status(201).json(mediaItem);
  } catch (error) {
    console.error('Error creating media item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Content Items API routes
app.get('/api/content', async (req, res) => {
  try {
    const contentItems = await prisma.contentItem.findMany({
      include: {
        region: true,
      },
    });
    res.json(contentItems);
  } catch (error) {
    console.error('Error fetching content items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const { 
      title_en, title_ar, title_fr, title_it, title_es,
      description_en, description_ar, description_fr, description_it, description_es,
      content_en, content_ar, content_fr, content_it, content_es,
      type, tags, authorId, mediaIds, regionId, categoryId, readTime, isFeatured 
    } = req.body;
    
    const contentItem = await prisma.contentItem.create({
      data: {
        title_en, title_ar, title_fr, title_it, title_es,
        description_en, description_ar, description_fr, description_it, description_es,
        content_en, content_ar, content_fr, content_it, content_es,
        type, tags, authorId, mediaIds, regionId, categoryId, readTime, isFeatured,
      },
      include: {
        region: true,
      },
    });
    res.status(201).json(contentItem);
  } catch (error) {
    console.error('Error creating content item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Transport Services API routes
app.get('/api/transport', async (req, res) => {
  try {
    const transportServices = await prisma.transportService.findMany({
      include: {
        regions: {
          include: {
            region: true,
          },
        },
        vehicleOptions: true,
        reviews: true,
      },
    });
    res.json(transportServices);
  } catch (error) {
    console.error('Error fetching transport services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/transport', async (req, res) => {
  try {
    const { 
      name_en, name_ar, name_fr, name_it, name_es,
      description_en, description_ar, description_fr, description_it, description_es,
      type_en, type_ar, type_fr, type_it, type_es,
      airportTransfer, imageUrls, email, phone, website, serviceArea 
    } = req.body;
    
    const transportService = await prisma.transportService.create({
      data: {
        name_en, name_ar, name_fr, name_it, name_es,
        description_en, description_ar, description_fr, description_it, description_es,
        type_en, type_ar, type_fr, type_it, type_es,
        airportTransfer, imageUrls, email, phone, website, serviceArea,
      },
    });
    res.status(201).json(transportService);
  } catch (error) {
    console.error('Error creating transport service:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reviews API routes
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        attraction: true,
        tourPackage: true,
        guide: true,
        transportService: true,
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { userId, itemId, itemType, rating, title, comment, helpfulVotes, verifiedUser, verifiedPurchase } = req.body;
    const review = await prisma.review.create({
      data: {
        userId,
        itemId,
        itemType,
        rating,
        title,
        comment,
        helpfulVotes,
        verifiedUser,
        verifiedPurchase,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Festivals API routes
app.get('/api/festivals', async (req, res) => {
  try {
    const festivals = await prisma.festival.findMany({
      include: {
        region: true,
      },
    });
    res.json(festivals);
  } catch (error) {
    console.error('Error fetching festivals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/festivals', async (req, res) => {
  try {
    const { 
      name, description, type, location, regionId, timeOfYear, duration, 
      images, videoUrl, established, historicalSignificance 
    } = req.body;
    
    const festival = await prisma.festival.create({
      data: {
        name, description, type, location, regionId, timeOfYear, duration,
        images, videoUrl, established, historicalSignificance,
      },
      include: {
        region: true,
      },
    });
    res.status(201).json(festival);
  } catch (error) {
    console.error('Error creating festival:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) festival
app.put('/api/festivals/:id', async (req, res) => {
  try {
    const festival = await prisma.festival.update({ where: { id: req.params.id }, data: req.body });
    res.json(festival);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// DELETE festival
app.delete('/api/festivals/:id', async (req, res) => {
  try {
    await prisma.festival.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cuisine API routes
app.get('/api/cuisines', async (req, res) => {
  try {
    const cuisines = await prisma.cuisine.findMany();
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cuisines', async (req, res) => {
  try {
    const { 
      name, description, type, regionIds, ingredients, spiceLevel, 
      images, videoUrl, popularVariants 
    } = req.body;
    
    const cuisine = await prisma.cuisine.create({
      data: {
        name, description, type, regionIds, ingredients, spiceLevel,
        images, videoUrl, popularVariants,
      },
    });
    res.status(201).json(cuisine);
  } catch (error) {
    console.error('Error creating cuisine:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT (update) cuisine
app.put('/api/cuisines/:id', async (req, res) => {
  try {
    const cuisine = await prisma.cuisine.update({ where: { id: req.params.id }, data: req.body });
    res.json(cuisine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// DELETE cuisine
app.delete('/api/cuisines/:id', async (req, res) => {
  try {
    await prisma.cuisine.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Heritage API routes
app.get('/api/heritages', async (req, res) => {
  try {
    const heritages = await prisma.heritage.findMany();
    res.json(heritages);
  } catch (error) {
    console.error('Error fetching heritages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/heritages/:id', async (req, res) => {
  try {
    const heritage = await prisma.heritage.findUnique({ where: { id: req.params.id } });
    if (!heritage) return res.status(404).json({ error: 'Not found' });
    res.json(heritage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/heritages', async (req, res) => {
  try {
    const heritage = await prisma.heritage.create({ data: req.body });
    res.status(201).json(heritage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/heritages/:id', async (req, res) => {
  try {
    const heritage = await prisma.heritage.update({ where: { id: req.params.id }, data: req.body });
    res.json(heritage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/heritages/:id', async (req, res) => {
  try {
    await prisma.heritage.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clothing API routes
app.get('/api/clothing', async (req, res) => {
  try {
    const clothing = await prisma.clothing.findMany();
    res.json(clothing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/clothing/:id', async (req, res) => {
  try {
    const clothing = await prisma.clothing.findUnique({ where: { id: req.params.id } });
    if (!clothing) return res.status(404).json({ error: 'Not found' });
    res.json(clothing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clothing', async (req, res) => {
  try {
    const clothing = await prisma.clothing.create({ data: req.body });
    res.status(201).json(clothing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/clothing/:id', async (req, res) => {
  try {
    const clothing = await prisma.clothing.update({ where: { id: req.params.id }, data: req.body });
    res.json(clothing);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/clothing/:id', async (req, res) => {
  try {
    await prisma.clothing.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Morocco by Rasha API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗺️  Regions: http://localhost:${PORT}/api/regions`);
  console.log(`🏛️  Attractions: http://localhost:${PORT}/api/attractions`);
  console.log(`🎒 Tour Packages: http://localhost:${PORT}/api/tour-packages`);
  console.log(`👨‍💼 Guides: http://localhost:${PORT}/api/guides`);
  console.log(`📸 Media: http://localhost:${PORT}/api/media`);
  console.log(`📝 Content: http://localhost:${PORT}/api/content`);
  console.log(`🚗 Transport: http://localhost:${PORT}/api/transport`);
  console.log(`⭐ Reviews: http://localhost:${PORT}/api/reviews`);
  console.log(`🎉 Festivals: http://localhost:${PORT}/api/festivals`);
  console.log(`🍽️  Cuisines: http://localhost:${PORT}/api/cuisines`);
  console.log(`🏺 Heritage: http://localhost:${PORT}/api/heritages`);
  console.log(`👕 Clothing: http://localhost:${PORT}/api/clothing`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
}); 