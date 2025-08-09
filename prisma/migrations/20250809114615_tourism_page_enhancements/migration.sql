/*
  Warnings:

  - Added the required column `regionId` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `transport_services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `accommodations` DROP FOREIGN KEY `accommodations_itineraryDayId_fkey`;

-- DropForeignKey
ALTER TABLE `attractions` DROP FOREIGN KEY `attractions_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `content_items` DROP FOREIGN KEY `content_items_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `festivals` DROP FOREIGN KEY `festivals_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `guide_regions` DROP FOREIGN KEY `guide_regions_guideId_fkey`;

-- DropForeignKey
ALTER TABLE `guide_regions` DROP FOREIGN KEY `guide_regions_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `itineraries` DROP FOREIGN KEY `itineraries_tourPackageId_fkey`;

-- DropForeignKey
ALTER TABLE `itinerary_days` DROP FOREIGN KEY `itinerary_days_itineraryId_fkey`;

-- DropForeignKey
ALTER TABLE `meals` DROP FOREIGN KEY `meals_itineraryDayId_fkey`;

-- DropForeignKey
ALTER TABLE `media_items` DROP FOREIGN KEY `media_items_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_attraction_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_guide_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_tour_package_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_transport_service_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_userId_fkey`;

-- DropForeignKey
ALTER TABLE `saved_items` DROP FOREIGN KEY `saved_items_userId_fkey`;

-- DropForeignKey
ALTER TABLE `search_queries` DROP FOREIGN KEY `search_queries_userId_fkey`;

-- DropForeignKey
ALTER TABLE `tour_package_regions` DROP FOREIGN KEY `tour_package_regions_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `tour_package_regions` DROP FOREIGN KEY `tour_package_regions_tourPackageId_fkey`;

-- DropForeignKey
ALTER TABLE `transport_service_regions` DROP FOREIGN KEY `transport_service_regions_regionId_fkey`;

-- DropForeignKey
ALTER TABLE `transport_service_regions` DROP FOREIGN KEY `transport_service_regions_transportServiceId_fkey`;

-- DropForeignKey
ALTER TABLE `user_preferences` DROP FOREIGN KEY `user_preferences_userId_fkey`;

-- DropForeignKey
ALTER TABLE `vehicle_options` DROP FOREIGN KEY `vehicle_options_transportServiceId_fkey`;

-- AlterTable
ALTER TABLE `attractions` MODIFY `imageUrls` LONGTEXT NOT NULL,
    MODIFY `tags` LONGTEXT NOT NULL,
    MODIFY `openingHours` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `clothing` MODIFY `regionIds` LONGTEXT NOT NULL,
    MODIFY `materials` LONGTEXT NOT NULL,
    MODIFY `occasions` LONGTEXT NOT NULL,
    MODIFY `images` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `content_items` MODIFY `tags` LONGTEXT NOT NULL,
    MODIFY `mediaIds` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `cuisines` MODIFY `regionIds` LONGTEXT NOT NULL,
    MODIFY `ingredients` LONGTEXT NOT NULL,
    MODIFY `images` LONGTEXT NOT NULL,
    MODIFY `popularVariants` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `festivals` MODIFY `images` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `guides` ADD COLUMN `available` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `rating` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `reviewCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `languages` LONGTEXT NOT NULL,
    MODIFY `specialties` LONGTEXT NOT NULL,
    MODIFY `certifications` LONGTEXT NOT NULL,
    MODIFY `imageUrls` LONGTEXT NOT NULL,
    MODIFY `availability` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `heritages` MODIFY `regionIds` LONGTEXT NOT NULL,
    MODIFY `images` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `itinerary_days` MODIFY `activities` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `media_items` MODIFY `tags` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `regions` MODIFY `imageUrls` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `tour_packages` ADD COLUMN `featured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `maxParticipants` INTEGER NULL,
    ADD COLUMN `rating` DOUBLE NULL DEFAULT 0,
    ADD COLUMN `regionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `reviewCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `imageUrls` LONGTEXT NOT NULL,
    MODIFY `included` LONGTEXT NOT NULL,
    MODIFY `excluded` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `transport_services` ADD COLUMN `available` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `type` VARCHAR(100) NOT NULL,
    MODIFY `imageUrls` LONGTEXT NOT NULL,
    MODIFY `serviceArea` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `user_preferences` MODIFY `favoriteRegions` LONGTEXT NOT NULL,
    MODIFY `preferredCategories` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `preferences` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `vehicle_options` MODIFY `features` LONGTEXT NOT NULL,
    MODIFY `imageUrls` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `travel_guides` (
    `id` VARCHAR(191) NOT NULL,
    `regionIds` LONGTEXT NOT NULL,
    `author` VARCHAR(255) NOT NULL,
    `publishedDate` DATETIME(3) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `tags` LONGTEXT NOT NULL,
    `imageUrls` LONGTEXT NOT NULL,
    `featuredImageUrl` VARCHAR(500) NULL,
    `videoUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `title_ar` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `title_es` VARCHAR(255) NOT NULL,
    `title_fr` VARCHAR(255) NOT NULL,
    `title_it` VARCHAR(255) NOT NULL,
    `description_ar` TEXT NULL,
    `description_en` TEXT NULL,
    `description_es` TEXT NULL,
    `description_fr` TEXT NULL,
    `description_it` TEXT NULL,
    `content_ar` LONGTEXT NULL,
    `content_en` LONGTEXT NULL,
    `content_es` LONGTEXT NULL,
    `content_fr` LONGTEXT NULL,
    `content_it` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `tour_packages_regionId_fkey` ON `tour_packages`(`regionId`);

-- AddForeignKey
ALTER TABLE `tour_package_regions` ADD CONSTRAINT `tour_package_regions_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `tour_packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tour_package_regions` ADD CONSTRAINT `tour_package_regions_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itineraries` ADD CONSTRAINT `itineraries_tourPackageId_fkey` FOREIGN KEY (`tourPackageId`) REFERENCES `tour_packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_days` ADD CONSTRAINT `itinerary_days_itineraryId_fkey` FOREIGN KEY (`itineraryId`) REFERENCES `itineraries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accommodations` ADD CONSTRAINT `accommodations_itineraryDayId_fkey` FOREIGN KEY (`itineraryDayId`) REFERENCES `itinerary_days`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meals` ADD CONSTRAINT `meals_itineraryDayId_fkey` FOREIGN KEY (`itineraryDayId`) REFERENCES `itinerary_days`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guide_regions` ADD CONSTRAINT `guide_regions_guideId_fkey` FOREIGN KEY (`guideId`) REFERENCES `guides`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `guide_regions` ADD CONSTRAINT `guide_regions_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transport_service_regions` ADD CONSTRAINT `transport_service_regions_transportServiceId_fkey` FOREIGN KEY (`transportServiceId`) REFERENCES `transport_services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transport_service_regions` ADD CONSTRAINT `transport_service_regions_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_options` ADD CONSTRAINT `vehicle_options_transportServiceId_fkey` FOREIGN KEY (`transportServiceId`) REFERENCES `transport_services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
