/*
  Warnings:

  - Added the required column `battery` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `charging` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `range` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "battery" TEXT NOT NULL,
ADD COLUMN     "charging" TEXT NOT NULL,
ADD COLUMN     "range" TEXT NOT NULL;
