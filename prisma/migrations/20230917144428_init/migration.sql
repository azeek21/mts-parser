/*
  Warnings:

  - Added the required column `withDiscount` to the `tariff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tariff" ADD COLUMN     "discountDescription" TEXT,
ADD COLUMN     "priceWithDiscount" INTEGER,
ADD COLUMN     "withDiscount" BOOLEAN NOT NULL;
