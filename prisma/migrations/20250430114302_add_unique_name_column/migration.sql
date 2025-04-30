/*
  Warnings:

  - A unique constraint covering the columns `[user_name]` on the table `front_user_info_master` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `front_user_login_master` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "front_user_login_master" ADD COLUMN     "user_name" VARCHAR(255) NOT NULL DEFAULT 'temp_user';

-- CreateIndex
CREATE UNIQUE INDEX "front_user_info_master_user_name_key" ON "front_user_info_master"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "front_user_login_master_user_name_key" ON "front_user_login_master"("user_name");
