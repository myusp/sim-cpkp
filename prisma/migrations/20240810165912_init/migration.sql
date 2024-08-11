-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jenisKelamin` VARCHAR(191) NULL,
    `alamatDomisili` VARCHAR(191) NULL,
    `alamatTinggal` VARCHAR(191) NULL,
    `unitTempatBekerjaTerakhir` VARCHAR(191) NULL,
    `mulaiBergabungRS` DATETIME(3) NULL,
    `mulaiBekerjaUnitTerakhir` DATETIME(3) NULL,
    `statusKepegawaian` VARCHAR(191) NULL,
    `pendidikanTerakhir` VARCHAR(191) NULL,
    `asalInstitusiPendidikan` VARCHAR(191) NULL,
    `kelulusanTahun` INTEGER NULL,
    `tanggalTerbitSTR` DATETIME(3) NULL,
    `tanggalBerakhirSTR` VARCHAR(191) NULL,
    `tanggalTerbitSIPP` DATETIME(3) NULL,
    `jabatanSaatIni` VARCHAR(191) NULL,
    `levelPKSaatIni` VARCHAR(191) NULL,
    `levelPKYangDiajukan` VARCHAR(191) NULL,
    `levelPerawatManajer` VARCHAR(191) NULL,
    `programMutuRCA` BOOLEAN NOT NULL,
    `setuju` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterOrientasi` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterPelatihan` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterCPD_PK1` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterCPD_PK2` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterCPD_PK3` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterCPD_PK4` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasterCPD_PK5` (
    `id` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserOrientasi` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `orientasiId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserOrientasi_userId_orientasiId_key`(`userId`, `orientasiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPelatihan` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pelatihanId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserPelatihan_userId_pelatihanId_key`(`userId`, `pelatihanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCPD_PK1` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cpdId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserCPD_PK1_userId_cpdId_key`(`userId`, `cpdId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCPD_PK2` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cpdId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserCPD_PK2_userId_cpdId_key`(`userId`, `cpdId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCPD_PK3` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cpdId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserCPD_PK3_userId_cpdId_key`(`userId`, `cpdId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCPD_PK4` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cpdId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserCPD_PK4_userId_cpdId_key`(`userId`, `cpdId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCPD_PK5` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `cpdId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserCPD_PK5_userId_cpdId_key`(`userId`, `cpdId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOrientasi` ADD CONSTRAINT `UserOrientasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOrientasi` ADD CONSTRAINT `UserOrientasi_orientasiId_fkey` FOREIGN KEY (`orientasiId`) REFERENCES `MasterOrientasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPelatihan` ADD CONSTRAINT `UserPelatihan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPelatihan` ADD CONSTRAINT `UserPelatihan_pelatihanId_fkey` FOREIGN KEY (`pelatihanId`) REFERENCES `MasterPelatihan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK1` ADD CONSTRAINT `UserCPD_PK1_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK1` ADD CONSTRAINT `UserCPD_PK1_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK1`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK2` ADD CONSTRAINT `UserCPD_PK2_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK2` ADD CONSTRAINT `UserCPD_PK2_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK2`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK3` ADD CONSTRAINT `UserCPD_PK3_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK3` ADD CONSTRAINT `UserCPD_PK3_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK3`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK4` ADD CONSTRAINT `UserCPD_PK4_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK4` ADD CONSTRAINT `UserCPD_PK4_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK4`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK5` ADD CONSTRAINT `UserCPD_PK5_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK5` ADD CONSTRAINT `UserCPD_PK5_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK5`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
