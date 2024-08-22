-- AlterTable
ALTER TABLE `UserLogbookKaru` ADD COLUMN `idMasterLogBooks` TEXT NULL;

-- CreateTable
CREATE TABLE `UserPenilaianKaru` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,
    `idMasterPenilaianKaru` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserJawabanPenilaianKaru` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUserPenilaianKaru` VARCHAR(191) NOT NULL,
    `idMasterPenilaianKaru` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserAssesmen` ADD CONSTRAINT `UserAssesmen_id_penilaian_fkey` FOREIGN KEY (`id_penilaian`) REFERENCES `UserPenilaianKaru`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPenilaianKaru` ADD CONSTRAINT `UserPenilaianKaru_email_fkey` FOREIGN KEY (`email`) REFERENCES `Akun`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJawabanPenilaianKaru` ADD CONSTRAINT `UserJawabanPenilaianKaru_idUserPenilaianKaru_fkey` FOREIGN KEY (`idUserPenilaianKaru`) REFERENCES `UserPenilaianKaru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJawabanPenilaianKaru` ADD CONSTRAINT `UserJawabanPenilaianKaru_idMasterPenilaianKaru_fkey` FOREIGN KEY (`idMasterPenilaianKaru`) REFERENCES `MasterPenilaianKaru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
