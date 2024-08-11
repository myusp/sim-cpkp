/*
  Warnings:

  - You are about to drop the column `nama` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pendidikanTerakhir` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `unitTempatBekerjaTerakhir` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `nama`,
    DROP COLUMN `pendidikanTerakhir`,
    DROP COLUMN `unitTempatBekerjaTerakhir`;

-- CreateTable
CREATE TABLE `Akun` (
    `iduser` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `last_login` DATETIME(3) NULL,
    `nama` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `pendidikanTerakhir` VARCHAR(191) NULL,
    `unitTempatBekerjaTerakhir` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `masterRumahSakitId` VARCHAR(191) NULL,
    `masterRuanganRSId` VARCHAR(191) NULL,

    UNIQUE INDEX `Akun_email_key`(`email`),
    PRIMARY KEY (`iduser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterRumahSakit` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterRuanganRS` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `id_rs` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterPertanyaanAssesmen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skp` VARCHAR(191) NULL,
    `sub_kategori` VARCHAR(191) NULL,
    `kode` VARCHAR(191) NULL,
    `keterampilan` VARCHAR(191) NULL,
    `vokasi` VARCHAR(191) NULL,
    `ners` VARCHAR(191) NULL,
    `tipe` VARCHAR(191) NULL,
    `priority` INTEGER NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAssesmen` (
    `id` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `skp_1` VARCHAR(191) NULL,
    `skp_2` VARCHAR(191) NULL,
    `skp_3` VARCHAR(191) NULL,
    `skp_4` VARCHAR(191) NULL,
    `skp_5` VARCHAR(191) NULL,
    `skp_6` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserJawabanAsesmen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skor` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UserAssesmenId` VARCHAR(191) NOT NULL,
    `MasterPertanyaanAssesmenId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Akun` ADD CONSTRAINT `Akun_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Akun` ADD CONSTRAINT `Akun_masterRumahSakitId_fkey` FOREIGN KEY (`masterRumahSakitId`) REFERENCES `MasterRumahSakit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Akun` ADD CONSTRAINT `Akun_masterRuanganRSId_fkey` FOREIGN KEY (`masterRuanganRSId`) REFERENCES `MasterRuanganRS`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasterRuanganRS` ADD CONSTRAINT `MasterRuanganRS_id_rs_fkey` FOREIGN KEY (`id_rs`) REFERENCES `MasterRumahSakit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAssesmen` ADD CONSTRAINT `UserAssesmen_email_fkey` FOREIGN KEY (`email`) REFERENCES `Akun`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJawabanAsesmen` ADD CONSTRAINT `UserJawabanAsesmen_UserAssesmenId_fkey` FOREIGN KEY (`UserAssesmenId`) REFERENCES `UserAssesmen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJawabanAsesmen` ADD CONSTRAINT `UserJawabanAsesmen_MasterPertanyaanAssesmenId_fkey` FOREIGN KEY (`MasterPertanyaanAssesmenId`) REFERENCES `MasterPertanyaanAssesmen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
