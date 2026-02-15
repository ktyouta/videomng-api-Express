/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `folder_master` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "favorite_video_folder_transaction" ADD COLUMN     "folder_master_id" BIGINT;

-- AlterTable
ALTER TABLE "folder_master" ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD COLUMN     "parent_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "folder_master_id_key" ON "folder_master"("id");
