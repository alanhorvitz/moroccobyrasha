# Tourism Page Prisma Models - Updates Summary

## Overview
Updated Prisma schema to support dynamic tourism page data based on your existing static data files.

## New Models Added

### 1. TravelGuide Model
```prisma
model TravelGuide {
  id             String   @id @default(cuid())
  regionIds      String   @db.LongText // JSON array of region IDs
  author         String   @db.VarChar(255)
  publishedDate  DateTime
  type           String   @db.VarChar(100) // general, specialized, thematic
  tags           String   @db.LongText // JSON array of tags
  imageUrls      String   @db.LongText // JSON array of image URLs
  featuredImageUrl String? @db.VarChar(500)
  videoUrl       String?  @db.VarChar(500)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  // Multilingual fields
  title_ar       String   @db.VarChar(255)
  title_en       String   @db.VarChar(255)
  title_es       String   @db.VarChar(255)
  title_fr       String   @db.VarChar(255)
  title_it       String   @db.VarChar(255)
  description_ar String?  @db.Text
  description_en String?  @db.Text
  description_es String?  @db.Text
  description_fr String?  @db.Text
  description_it String?  @db.Text
  content_ar     String?  @db.LongText
  content_en     String?  @db.LongText
  content_es     String?  @db.LongText
  content_fr     String?  @db.LongText
  content_it     String?  @db.LongText

  @@map("travel_guides")
}
```

## Enhanced Existing Models

### 1. TourPackage Model Enhancements
**Added fields:**
- `regionId`: String - Direct region reference
- `maxParticipants`: Int? - Maximum number of participants
- `featured`: Boolean - Whether the tour is featured
- `rating`: Float? - Average rating
- `reviewCount`: Int - Number of reviews
- Added proper relationships and index

### 2. Guide Model Enhancements
**Added fields:**
- `rating`: Float? - Average guide rating
- `reviewCount`: Int - Number of reviews
- `available`: Boolean - Availability status
- Added proper relationships

### 3. TransportService Model Enhancements
**Added fields:**
- `type`: String - Service type (car, 4x4, bus, airport)
- `available`: Boolean - Availability status
- Added proper relationships

## Data Mapping Guide

### From Static Data to Database

#### TourPackages Mapping:
- `id` → `id`
- `title` → `title_en` (adapt for other languages)
- `description` → `description_en`
- `regionId` → `regionId`
- `duration` → `duration`
- `price` → `price`
- `inclusions` → `included` (JSON.stringify array)
- `exclusions` → `excluded` (JSON.stringify array)
- `images` → `imageUrls` (JSON.stringify array)
- `maxParticipants` → `maxParticipants`
- `featured` → `featured`
- `rating` → `rating`
- `reviewCount` → `reviewCount`
- `itinerary` → Separate `Itinerary` and `ItineraryDay` records

#### TravelGuides Mapping:
- `id` → `id`
- `title` → `title_en`
- `description` → `description_en`
- `regionIds` → `regionIds` (JSON.stringify array)
- `content` → `content_en`
- `author` → `author`
- `publishedDate` → `publishedDate`
- `type` → `type`
- `tags` → `tags` (JSON.stringify array)
- `images` → `imageUrls` (JSON.stringify array)
- `featuredImage` → `featuredImageUrl`
- `videoUrl` → `videoUrl`

#### TransportServices Mapping:
- `id` → `id`
- `name` → `name_en`
- `type` → `type`
- `description` → `description_en`
- `pricePerDay` → Via `VehicleOption.pricePerDay`
- `features` → Via `VehicleOption.features`
- `imageUrl` → `imageUrls` (as JSON array)
- `capacity` → Via `VehicleOption.capacity`
- `available` → `available`

## Migration Steps

1. **Generate Migration:**
   ```bash
   npx prisma migrate dev --name tourism-page-enhancements
   ```

2. **Apply Migration:**
   ```bash
   npx prisma generate
   ```

3. **Seed Database (if needed):**
   Create seed script to populate with your static data

## Notes

- Virtual tours were excluded as requested
- All existing models were preserved and only enhanced
- Multilingual support maintained for all text fields
- JSON fields used for arrays to maintain flexibility
- Proper indexes added for performance
- Relationships properly defined for data integrity

## Next Steps

1. Run the migration
2. Create seed scripts to populate with your static data
3. Update your application code to use Prisma Client
4. Test the data relationships and queries 