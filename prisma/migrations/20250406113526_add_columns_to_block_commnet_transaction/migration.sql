/*
  Warnings:

  - Added the required column `video_id` to the `block_commnet_transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video_id` to the `favorite_commnet_transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "block_commnet_transaction" ADD COLUMN     "video_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "favorite_commnet_transaction" ADD COLUMN     "video_id" VARCHAR(255) NOT NULL;
