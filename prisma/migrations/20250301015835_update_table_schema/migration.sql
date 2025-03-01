/*
  Warnings:

  - The primary key for the `favorite_video_comment_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `favorite_video_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `video_comment_seq` on the `favorite_video_comment_transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "favorite_video_comment_transaction" DROP CONSTRAINT "favorite_video_comment_transaction_pkey",
DROP COLUMN "video_comment_seq",
ADD COLUMN     "video_comment_seq" INTEGER NOT NULL,
ADD CONSTRAINT "favorite_video_comment_transaction_pkey" PRIMARY KEY ("user_id", "video_id", "video_comment_seq");

-- AlterTable
ALTER TABLE "favorite_video_transaction" DROP CONSTRAINT "favorite_video_transaction_pkey",
ADD CONSTRAINT "favorite_video_transaction_pkey" PRIMARY KEY ("user_id", "video_id");
