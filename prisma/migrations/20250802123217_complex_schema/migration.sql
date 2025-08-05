/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_authorId_fkey`;

-- DropTable
DROP TABLE `posts`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `regions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `imageUrls` JSON NOT NULL,
    `climate` VARCHAR(100) NULL,
    `bestTimeToVisit` VARCHAR(100) NULL,
    `keyFacts` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attractions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `regionId` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `imageUrls` JSON NOT NULL,
    `category` VARCHAR(100) NULL,
    `rating` DOUBLE NULL DEFAULT 0,
    `tags` JSON NOT NULL,
    `entryFee` DOUBLE NULL DEFAULT 0,
    `currency` VARCHAR(10) NULL DEFAULT 'MAD',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `openingHours` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tour_packages` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `duration` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'MAD',
    `difficulty` VARCHAR(50) NULL,
    `imageUrls` JSON NOT NULL,
    `included` JSON NOT NULL,
    `excluded` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tour_package_regions` (
    `id` VARCHAR(191) NOT NULL,
    `tourPackageId` VARCHAR(191) NOT NULL,
    `regionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tour_package_regions_tourPackageId_regionId_key`(`tourPackageId`, `regionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itineraries` (
    `id` VARCHAR(191) NOT NULL,
    `tourPackageId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `itineraries_tourPackageId_key`(`tourPackageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_days` (
    `id` VARCHAR(191) NOT NULL,
    `itineraryId` VARCHAR(191) NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `title` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `activities` JSON NOT NULL,

    UNIQUE INDEX `itinerary_days_itineraryId_dayNumber_key`(`itineraryId`, `dayNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accommodations` (
    `id` VARCHAR(191) NOT NULL,
    `itineraryDayId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(100) NULL,
    `address` TEXT NULL,
    `stars` INTEGER NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `accommodations_itineraryDayId_key`(`itineraryDayId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meals` (
    `id` VARCHAR(191) NOT NULL,
    `itineraryDayId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `included` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `media_items` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(50) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `thumbnailUrl` VARCHAR(500) NULL,
    `tags` JSON NOT NULL,
    `regionId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(100) NULL,
    `uploadDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `photographer` VARCHAR(255) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content_items` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `content` LONGTEXT NULL,
    `type` VARCHAR(50) NOT NULL,
    `tags` JSON NOT NULL,
    `authorId` VARCHAR(191) NULL,
    `publishDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `mediaIds` JSON NOT NULL,
    `regionId` VARCHAR(191) NULL,
    `categoryId` VARCHAR(100) NULL,
    `readTime` INTEGER NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guides` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `languages` JSON NOT NULL,
    `specialties` JSON NOT NULL,
    `certifications` JSON NOT NULL,
    `yearsOfExperience` INTEGER NULL DEFAULT 0,
    `imageUrls` JSON NOT NULL,
    `hourlyRate` DOUBLE NULL,
    `currency` VARCHAR(10) NULL DEFAULT 'MAD',
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `website` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `availability` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guide_regions` (
    `id` VARCHAR(191) NOT NULL,
    `guideId` VARCHAR(191) NOT NULL,
    `regionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `guide_regions_guideId_regionId_key`(`guideId`, `regionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transport_services` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(100) NOT NULL,
    `airportTransfer` BOOLEAN NOT NULL DEFAULT false,
    `imageUrls` JSON NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(50) NULL,
    `website` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `serviceArea` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transport_service_regions` (
    `id` VARCHAR(191) NOT NULL,
    `transportServiceId` VARCHAR(191) NOT NULL,
    `regionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `transport_service_regions_transportServiceId_regionId_key`(`transportServiceId`, `regionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle_options` (
    `id` VARCHAR(191) NOT NULL,
    `transportServiceId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `pricePerDay` DOUBLE NOT NULL,
    `currency` VARCHAR(10) NOT NULL DEFAULT 'MAD',
    `features` JSON NOT NULL,
    `imageUrls` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(50) NOT NULL,
    `rating` DOUBLE NOT NULL,
    `title` VARCHAR(255) NULL,
    `comment` TEXT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `helpfulVotes` INTEGER NOT NULL DEFAULT 0,
    `verifiedUser` BOOLEAN NOT NULL DEFAULT false,
    `verifiedPurchase` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_preferences` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `language` VARCHAR(10) NOT NULL DEFAULT 'en',
    `currency` VARCHAR(10) NOT NULL DEFAULT 'MAD',
    `favoriteRegions` JSON NOT NULL,
    `preferredCategories` JSON NOT NULL,
    `darkMode` BOOLEAN NOT NULL DEFAULT false,
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_preferences_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved_items` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `itemId` VARCHAR(191) NOT NULL,
    `itemType` VARCHAR(50) NOT NULL,
    `savedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,

    UNIQUE INDEX `saved_items_userId_itemId_itemType_key`(`userId`, `itemId`, `itemType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `search_queries` (
    `id` VARCHAR(191) NOT NULL,
    `query` VARCHAR(500) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `count` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attractions` ADD CONSTRAINT `attractions_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_package_regions` ADD CONSTRAINT `tour_package_regions_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `tour_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_package_regions` ADD CONSTRAINT `tour_package_regions_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itineraries` ADD CONSTRAINT `itineraries_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `tour_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_days` ADD CONSTRAINT `itinerary_days_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itineraries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accommodations` ADD CONSTRAINT `accommodations_itineraryDayId_fkey` FOREIGN KEY (`itineraryDayId`) REFERENCES `itinerary_days`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meals` ADD CONSTRAINT `meals_itineraryDayId_fkey` FOREIGN KEY (`itineraryDayId`) REFERENCES `itinerary_days`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media_items` ADD CONSTRAINT `media_items_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `content_items` ADD CONSTRAINT `content_items_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guide_regions` ADD CONSTRAINT `guide_regions_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `guides`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guide_regions` ADD CONSTRAINT `guide_regions_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transport_service_regions` ADD CONSTRAINT `transport_service_regions_transportServiceId_fkey` FOREIGN KEY (`transportServiceId`) REFERENCES `transport_services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transport_service_regions` ADD CONSTRAINT `transport_service_regions_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_options` ADD CONSTRAINT `vehicle_options_transportServiceId_fkey` FOREIGN KEY (`transportServiceId`) REFERENCES `transport_services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_attraction_fkey` FOREIGN KEY (`itemId`) REFERENCES `attractions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_tour_package_fkey` FOREIGN KEY (`itemId`) REFERENCES `tour_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_guide_fkey` FOREIGN KEY (`itemId`) REFERENCES `guides`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_transport_service_fkey` FOREIGN KEY (`itemId`) REFERENCES `transport_services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
