/*
  Warnings:

  - You are about to drop the column `animalType` on the `Product` table. All the data in the column will be lost.
  - Added the required column `petType` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('FOOD', 'HARNESS', 'ACCESSORY', 'TOY', 'HYGIENE');

-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('CAT', 'DOG', 'UNIVERSAL');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('BABY', 'ADULT', 'SENIOR', 'UNIVERSAL');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "animalType",
ADD COLUMN     "ageGroup" "AgeGroup" NOT NULL DEFAULT 'UNIVERSAL',
ADD COLUMN     "caloriesPer100g" DOUBLE PRECISION,
ADD COLUMN     "chestMaxCm" DOUBLE PRECISION,
ADD COLUMN     "chestMinCm" DOUBLE PRECISION,
ADD COLUMN     "feedingMaxGPerDay" INTEGER,
ADD COLUMN     "feedingMinGPerDay" INTEGER,
ADD COLUMN     "foodType" TEXT,
ADD COLUMN     "neckMaxCm" DOUBLE PRECISION,
ADD COLUMN     "neckMinCm" DOUBLE PRECISION,
ADD COLUMN     "petType" "PetType" NOT NULL,
ADD COLUMN     "productType" "ProductType" NOT NULL,
ADD COLUMN     "recommendedWeightMaxKg" DOUBLE PRECISION,
ADD COLUMN     "recommendedWeightMinKg" DOUBLE PRECISION,
ADD COLUMN     "sizeLabel" TEXT;
