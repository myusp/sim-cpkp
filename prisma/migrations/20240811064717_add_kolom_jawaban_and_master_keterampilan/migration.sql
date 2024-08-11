/*
  Warnings:

  - Added the required column `jawaban` to the `UserJawabanAsesmen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserJawabanAsesmen` ADD COLUMN `jawaban` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `MasterKeterampilanDiagnosis` (
    `id` VARCHAR(191) NOT NULL,
    `nama_kompetensi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterKeterampilanIntervensi` (
    `id` VARCHAR(191) NOT NULL,
    `nama_kompetensi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
