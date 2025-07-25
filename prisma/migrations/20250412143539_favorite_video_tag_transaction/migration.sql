-- CreateTable
CREATE TABLE "favorite_video_tag_transaction" (
    "user_id" INTEGER NOT NULL,
    "video_id" VARCHAR(255) NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "delete_flg" CHAR(1) NOT NULL,

    CONSTRAINT "favorite_video_tag_transaction_pkey" PRIMARY KEY ("user_id","video_id","tag_id")
);
