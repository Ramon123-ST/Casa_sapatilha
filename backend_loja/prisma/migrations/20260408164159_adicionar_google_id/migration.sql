/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `googleId` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_googleId_key` ON `usuarios`(`googleId`);
