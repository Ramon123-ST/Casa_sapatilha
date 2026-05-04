-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `reset_token` VARCHAR(255) NULL,
    ADD COLUMN `reset_token_exp` TIMESTAMP(0) NULL;
