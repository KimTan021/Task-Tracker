ALTER TABLE `user`
ADD COLUMN `user_role` VARCHAR(12) NOT NULL DEFAULT 'ROLE_USER' ;

UPDATE `user`
SET user_role = 'ROLE_ADMIN' WHERE user_email = 'hwell@admin.com';
