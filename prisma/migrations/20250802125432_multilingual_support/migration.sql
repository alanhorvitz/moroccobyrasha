/*
  Warnings:

  - You are about to drop the column `description` on the `accommodations` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `accommodations` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `accommodations` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `attractions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `attractions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `attractions` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `content_items` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `content_items` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `content_items` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `guides` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `guides` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `itinerary_days` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `itinerary_days` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `media_items` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `media_items` table. All the data in the column will be lost.
  - You are about to drop the column `bestTimeToVisit` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `climate` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `keyFacts` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `tour_packages` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transport_services` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `transport_services` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `transport_services` table. All the data in the column will be lost.
  - Added the required column `name_ar` to the `accommodations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `accommodations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `accommodations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `accommodations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_it` to the `accommodations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_it` to the `attractions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_ar` to the `content_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_en` to the `content_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_es` to the `content_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_fr` to the `content_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_it` to the `content_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `guides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `guides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `guides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `guides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_it` to the `guides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_ar` to the `media_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_en` to the `media_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_es` to the `media_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_fr` to the `media_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_it` to the `media_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `regions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `regions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `regions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `regions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_it` to the `regions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_ar` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_en` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_es` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_fr` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_it` to the `tour_packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_es` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_it` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_ar` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_en` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_es` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_fr` to the `transport_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type_it` to the `transport_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `accommodations` DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `type`,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `name_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_it` VARCHAR(255) NOT NULL,
    ADD COLUMN `type_ar` VARCHAR(100) NULL,
    ADD COLUMN `type_en` VARCHAR(100) NULL,
    ADD COLUMN `type_es` VARCHAR(100) NULL,
    ADD COLUMN `type_fr` VARCHAR(100) NULL,
    ADD COLUMN `type_it` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `attractions` DROP COLUMN `category`,
    DROP COLUMN `description`,
    DROP COLUMN `name`,
    ADD COLUMN `category_ar` VARCHAR(100) NULL,
    ADD COLUMN `category_en` VARCHAR(100) NULL,
    ADD COLUMN `category_es` VARCHAR(100) NULL,
    ADD COLUMN `category_fr` VARCHAR(100) NULL,
    ADD COLUMN `category_it` VARCHAR(100) NULL,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `name_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_it` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `content_items` DROP COLUMN `content`,
    DROP COLUMN `description`,
    DROP COLUMN `title`,
    ADD COLUMN `content_ar` LONGTEXT NULL,
    ADD COLUMN `content_en` LONGTEXT NULL,
    ADD COLUMN `content_es` LONGTEXT NULL,
    ADD COLUMN `content_fr` LONGTEXT NULL,
    ADD COLUMN `content_it` LONGTEXT NULL,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `title_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_it` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `guides` DROP COLUMN `description`,
    DROP COLUMN `name`,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `name_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_it` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `itinerary_days` DROP COLUMN `description`,
    DROP COLUMN `title`,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `title_ar` VARCHAR(255) NULL,
    ADD COLUMN `title_en` VARCHAR(255) NULL,
    ADD COLUMN `title_es` VARCHAR(255) NULL,
    ADD COLUMN `title_fr` VARCHAR(255) NULL,
    ADD COLUMN `title_it` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `meals` DROP COLUMN `description`,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL;

-- AlterTable
ALTER TABLE `media_items` DROP COLUMN `description`,
    DROP COLUMN `title`,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `title_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_it` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `regions` DROP COLUMN `bestTimeToVisit`,
    DROP COLUMN `climate`,
    DROP COLUMN `description`,
    DROP COLUMN `keyFacts`,
    DROP COLUMN `name`,
    ADD COLUMN `bestTimeToVisit_ar` VARCHAR(100) NULL,
    ADD COLUMN `bestTimeToVisit_en` VARCHAR(100) NULL,
    ADD COLUMN `bestTimeToVisit_es` VARCHAR(100) NULL,
    ADD COLUMN `bestTimeToVisit_fr` VARCHAR(100) NULL,
    ADD COLUMN `bestTimeToVisit_it` VARCHAR(100) NULL,
    ADD COLUMN `climate_ar` VARCHAR(100) NULL,
    ADD COLUMN `climate_en` VARCHAR(100) NULL,
    ADD COLUMN `climate_es` VARCHAR(100) NULL,
    ADD COLUMN `climate_fr` VARCHAR(100) NULL,
    ADD COLUMN `climate_it` VARCHAR(100) NULL,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `keyFacts_ar` TEXT NULL,
    ADD COLUMN `keyFacts_en` TEXT NULL,
    ADD COLUMN `keyFacts_es` TEXT NULL,
    ADD COLUMN `keyFacts_fr` TEXT NULL,
    ADD COLUMN `keyFacts_it` TEXT NULL,
    ADD COLUMN `name_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_it` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `tour_packages` DROP COLUMN `description`,
    DROP COLUMN `difficulty`,
    DROP COLUMN `title`,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `difficulty_ar` VARCHAR(50) NULL,
    ADD COLUMN `difficulty_en` VARCHAR(50) NULL,
    ADD COLUMN `difficulty_es` VARCHAR(50) NULL,
    ADD COLUMN `difficulty_fr` VARCHAR(50) NULL,
    ADD COLUMN `difficulty_it` VARCHAR(50) NULL,
    ADD COLUMN `title_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `title_it` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `transport_services` DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `type`,
    ADD COLUMN `description_ar` TEXT NULL,
    ADD COLUMN `description_en` TEXT NULL,
    ADD COLUMN `description_es` TEXT NULL,
    ADD COLUMN `description_fr` TEXT NULL,
    ADD COLUMN `description_it` TEXT NULL,
    ADD COLUMN `name_ar` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_en` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_es` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_fr` VARCHAR(255) NOT NULL,
    ADD COLUMN `name_it` VARCHAR(255) NOT NULL,
    ADD COLUMN `type_ar` VARCHAR(100) NOT NULL,
    ADD COLUMN `type_en` VARCHAR(100) NOT NULL,
    ADD COLUMN `type_es` VARCHAR(100) NOT NULL,
    ADD COLUMN `type_fr` VARCHAR(100) NOT NULL,
    ADD COLUMN `type_it` VARCHAR(100) NOT NULL;
