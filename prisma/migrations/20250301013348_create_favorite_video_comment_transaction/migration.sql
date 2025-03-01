-- CreateTable
CREATE TABLE "favorite_video_comment_transaction" (
    "user_id" INTEGER NOT NULL,
    "video_id" VARCHAR(255) NOT NULL,
    "video_comment_seq" VARCHAR(255) NOT NULL,
    "video_comment" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "delete_flg" CHAR(1) NOT NULL,

    CONSTRAINT "favorite_video_comment_transaction_pkey" PRIMARY KEY ("user_id")
);
