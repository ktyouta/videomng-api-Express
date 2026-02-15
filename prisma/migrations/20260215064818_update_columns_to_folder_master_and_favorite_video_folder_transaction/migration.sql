/*
  Warnings:

  - The primary key for the `favorite_video_folder_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `folder_master_id` on the `favorite_video_folder_transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `folder_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `folder_master` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `parent_id` on the `folder_master` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "favorite_video_folder_transaction" DROP CONSTRAINT "favorite_video_folder_transaction_folder_master_id_fkey";

-- DropForeignKey
ALTER TABLE "folder_master" DROP CONSTRAINT "folder_master_parent_id_fkey";

-- AlterTable
ALTER TABLE "favorite_video_folder_transaction" DROP CONSTRAINT "favorite_video_folder_transaction_pkey",
ALTER COLUMN "folder_master_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "favorite_video_folder_transaction_pkey" PRIMARY KEY ("folder_master_id", "video_id");

-- AlterTable
ALTER TABLE "folder_master" DROP CONSTRAINT "folder_master_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "parent_id" SET DATA TYPE INTEGER,
ADD CONSTRAINT "folder_master_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "folder_master" ADD CONSTRAINT "folder_master_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "folder_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_video_folder_transaction" ADD CONSTRAINT "favorite_video_folder_transaction_folder_master_id_fkey" FOREIGN KEY ("folder_master_id") REFERENCES "folder_master"("id") ON DELETE CASCADE ON UPDATE CASCADE;
