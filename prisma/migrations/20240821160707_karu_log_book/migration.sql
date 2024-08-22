-- CreateTable
CREATE TABLE `MasterLogBookKaru` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `skp` VARCHAR(191) NOT NULL,
    `kegiatan` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLogbookKaru` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserLogbookKaru_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserJawabanLogBookKaru` (
    `id` VARCHAR(191) NOT NULL,
    `idUserLogBookKaru` VARCHAR(191) NOT NULL,
    `idMasterLogBookKaru` INTEGER NOT NULL,
    `jawaban` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserLogbookKaru` ADD CONSTRAINT `UserLogbookKaru_email_fkey` FOREIGN KEY (`email`) REFERENCES `Akun`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJawabanLogBookKaru` ADD CONSTRAINT `UserJawabanLogBookKaru_idUserLogBookKaru_fkey` FOREIGN KEY (`idUserLogBookKaru`) REFERENCES `UserLogbookKaru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJawabanLogBookKaru` ADD CONSTRAINT `UserJawabanLogBookKaru_idMasterLogBookKaru_fkey` FOREIGN KEY (`idMasterLogBookKaru`) REFERENCES `MasterLogBookKaru`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
