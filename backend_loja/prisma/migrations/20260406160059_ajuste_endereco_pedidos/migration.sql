/*
  Warnings:

  - You are about to drop the column `cep` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `itens_pedido` MODIFY `quantidade` INTEGER NULL DEFAULT 1,
    MODIFY `tamanho_escolhido` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `pedidos` ADD COLUMN `bairro` VARCHAR(100) NULL,
    ADD COLUMN `cep` VARCHAR(9) NULL,
    ADD COLUMN `numero` VARCHAR(20) NULL,
    ADD COLUMN `rua` VARCHAR(255) NULL,
    MODIFY `status` VARCHAR(50) NULL DEFAULT 'Pago';

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `cep`,
    DROP COLUMN `endereco`;
