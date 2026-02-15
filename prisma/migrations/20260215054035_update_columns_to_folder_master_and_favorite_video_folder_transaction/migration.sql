/*
  Warnings:

  - The primary key for the `favorite_video_folder_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `folder_id` on the `favorite_video_folder_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `favorite_video_folder_transaction` table. All the data in the column will be lost.
  - The primary key for the `folder_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `folder_id` on the `folder_master` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,parent_id,name]` on the table `folder_master` will be added. If there are existing duplicate values, this will fail.
  - Made the column `folder_master_id` on table `favorite_video_folder_transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "folder_master_id_key";

-- AlterTable
ALTER TABLE "favorite_video_folder_transaction" DROP CONSTRAINT "favorite_video_folder_transaction_pkey",
DROP COLUMN "folder_id",
DROP COLUMN "user_id",
ALTER COLUMN "folder_master_id" SET NOT NULL,
ADD CONSTRAINT "favorite_video_folder_transaction_pkey" PRIMARY KEY ("folder_master_id", "video_id");

-- AlterTable
ALTER TABLE "folder_master" DROP CONSTRAINT "folder_master_pkey",
DROP COLUMN "folder_id",
ADD CONSTRAINT "folder_master_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "folder_master_user_id_parent_id_name_key" ON "folder_master"("user_id", "parent_id", "name");

-- AddForeignKey
ALTER TABLE "folder_master" ADD CONSTRAINT "folder_master_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "folder_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_video_folder_transaction" ADD CONSTRAINT "favorite_video_folder_transaction_folder_master_id_fkey" FOREIGN KEY ("folder_master_id") REFERENCES "folder_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;
