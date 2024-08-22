/*
  Warnings:

  - Added the required column `userAsesmenId` to the `UserLogbookKaru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserLogbookKaru` ADD COLUMN `userAsesmenId` VARCHAR(191) NOT NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `UserLogbookKaru` ADD CONSTRAINT `UserLogbookKaru_userAsesmenId_fkey` FOREIGN KEY (`userAsesmenId`) REFERENCES `UserAssesmen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
