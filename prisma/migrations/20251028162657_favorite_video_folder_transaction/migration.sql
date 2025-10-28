-- CreateTable
CREATE TABLE "favorite_video_folder_transaction" (
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER NOT NULL,
    "video_id" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "update_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "favorite_video_folder_transaction_pkey" PRIMARY KEY ("user_id","folder_id","video_id")
);
