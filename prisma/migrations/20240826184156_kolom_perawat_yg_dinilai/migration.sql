/*
  Warnings:

  - Added the required column `email_perawat` to the `UserPenilaianKaru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserPenilaianKaru` ADD COLUMN `email_perawat` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `UserPenilaianKaru` ADD CONSTRAINT `UserPenilaianKaru_email_perawat_fkey` FOREIGN KEY (`email_perawat`) REFERENCES `Akun`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
