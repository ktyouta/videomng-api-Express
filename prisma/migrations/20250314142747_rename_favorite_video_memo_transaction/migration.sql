/*
  Warnings:

  - You are about to drop the `favorite_video_comment_transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "favorite_video_comment_transaction";

-- CreateTable
CREATE TABLE "favorite_video_memo_transaction" (
    "user_id" INTEGER NOT NULL,
    "video_id" VARCHAR(255) NOT NULL,
    "video_memo_seq" INTEGER NOT NULL,
    "video_memo" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "delete_flg" CHAR(1) NOT NULL,

    CONSTRAINT "favorite_video_memo_transaction_pkey" PRIMARY KEY ("user_id","video_id","video_memo_seq")
);
