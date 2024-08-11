/*
  Warnings:

  - The primary key for the `MasterCPD_PK1` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasterCPD_PK1` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MasterCPD_PK2` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasterCPD_PK2` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MasterCPD_PK3` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasterCPD_PK3` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MasterCPD_PK4` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasterCPD_PK4` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MasterCPD_PK5` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasterCPD_PK5` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MasterOrientasi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasterOrientasi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MasterPelatihan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasterPelatihan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `UserCPD_PK1` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserCPD_PK1` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cpdId` on the `UserCPD_PK1` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `UserCPD_PK2` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserCPD_PK2` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cpdId` on the `UserCPD_PK2` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `UserCPD_PK3` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserCPD_PK3` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cpdId` on the `UserCPD_PK3` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `UserCPD_PK4` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserCPD_PK4` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cpdId` on the `UserCPD_PK4` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `UserCPD_PK5` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserCPD_PK5` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cpdId` on the `UserCPD_PK5` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `orientasiId` on the `UserOrientasi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `pelatihanId` on the `UserPelatihan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `UserCPD_PK1` DROP FOREIGN KEY `UserCPD_PK1_cpdId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCPD_PK2` DROP FOREIGN KEY `UserCPD_PK2_cpdId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCPD_PK3` DROP FOREIGN KEY `UserCPD_PK3_cpdId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCPD_PK4` DROP FOREIGN KEY `UserCPD_PK4_cpdId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCPD_PK5` DROP FOREIGN KEY `UserCPD_PK5_cpdId_fkey`;

-- DropForeignKey
ALTER TABLE `UserOrientasi` DROP FOREIGN KEY `UserOrientasi_orientasiId_fkey`;

-- DropForeignKey
ALTER TABLE `UserPelatihan` DROP FOREIGN KEY `UserPelatihan_pelatihanId_fkey`;

-- AlterTable
ALTER TABLE `MasterCPD_PK1` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MasterCPD_PK2` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MasterCPD_PK3` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MasterCPD_PK4` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MasterCPD_PK5` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MasterOrientasi` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MasterPelatihan` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserCPD_PK1` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `cpdId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserCPD_PK2` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `cpdId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserCPD_PK3` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `cpdId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserCPD_PK4` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `cpdId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserCPD_PK5` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `cpdId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserOrientasi` MODIFY `orientasiId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `UserPelatihan` MODIFY `pelatihanId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserOrientasi` ADD CONSTRAINT `UserOrientasi_orientasiId_fkey` FOREIGN KEY (`orientasiId`) REFERENCES `MasterOrientasi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPelatihan` ADD CONSTRAINT `UserPelatihan_pelatihanId_fkey` FOREIGN KEY (`pelatihanId`) REFERENCES `MasterPelatihan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK1` ADD CONSTRAINT `UserCPD_PK1_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK1`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK2` ADD CONSTRAINT `UserCPD_PK2_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK2`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK3` ADD CONSTRAINT `UserCPD_PK3_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK3`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK4` ADD CONSTRAINT `UserCPD_PK4_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK4`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCPD_PK5` ADD CONSTRAINT `UserCPD_PK5_cpdId_fkey` FOREIGN KEY (`cpdId`) REFERENCES `MasterCPD_PK5`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
