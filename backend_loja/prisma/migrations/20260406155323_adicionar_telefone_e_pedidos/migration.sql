-- DropForeignKey
ALTER TABLE `estoque` DROP FOREIGN KEY `estoque_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `itens_pedido` DROP FOREIGN KEY `itens_pedido_pedido_id_fkey`;

-- DropForeignKey
ALTER TABLE `itens_pedido` DROP FOREIGN KEY `itens_pedido_produto_id_fkey`;

-- DropForeignKey
ALTER TABLE `pedidos` DROP FOREIGN KEY `pedidos_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `produtos` DROP FOREIGN KEY `produtos_categoria_id_fkey`;

-- AlterTable
ALTER TABLE `estoque` MODIFY `tamanho` VARCHAR(10) NOT NULL,
    MODIFY `quantidade` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `produtos` ADD COLUMN `imagem_2` VARCHAR(255) NULL,
    ADD COLUMN `imagem_3` VARCHAR(255) NULL,
    MODIFY `cor` VARCHAR(50) NULL DEFAULT 'Padrão',
    MODIFY `status` VARCHAR(20) NULL DEFAULT 'Ativo';

-- AlterTable
ALTER TABLE `usuarios` MODIFY `tipo` VARCHAR(20) NULL DEFAULT 'cliente';

-- AddForeignKey
ALTER TABLE `produtos` ADD CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `estoque` ADD CONSTRAINT `estoque_ibfk_1` FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pedidos` ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itens_pedido` ADD CONSTRAINT `itens_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itens_pedido` ADD CONSTRAINT `itens_pedido_ibfk_2` FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `estoque` RENAME INDEX `estoque_produto_id_idx` TO `estoque_ibfk_1`;

-- RenameIndex
ALTER TABLE `itens_pedido` RENAME INDEX `pedido_id` TO `itens_pedido_ibfk_1`;

-- RenameIndex
ALTER TABLE `itens_pedido` RENAME INDEX `produto_id` TO `itens_pedido_ibfk_2`;

-- RenameIndex
ALTER TABLE `pedidos` RENAME INDEX `usuario_id` TO `pedidos_ibfk_1`;

-- RenameIndex
ALTER TABLE `produtos` RENAME INDEX `categoria_id` TO `produtos_ibfk_1`;
