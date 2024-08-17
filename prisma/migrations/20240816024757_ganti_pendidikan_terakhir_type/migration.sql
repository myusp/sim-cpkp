/*
  Warnings:

  - You are about to alter the column `pendidikanTerakhir` on the `Akun` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Akun` MODIFY `pendidikanTerakhir` ENUM('VOKASI', 'NERS', 'S2_NERS') NULL;
