-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "searchBoost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "searchKeywords" TEXT[],
ADD COLUMN     "searchNormalized" TEXT;
