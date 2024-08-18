/*
  Warnings:

  - The values [S2_NERS] on the enum `Akun_pendidikanTerakhir` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Akun` MODIFY `pendidikanTerakhir` ENUM('VOKASI', 'NERS', 'S2_KEP') NULL;
