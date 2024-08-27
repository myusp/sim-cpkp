/*
  Warnings:

  - Added the required column `Skor` to the `UserJawabanPenilaianKaru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserJawabanPenilaianKaru` ADD COLUMN `Skor` INTEGER NOT NULL;
