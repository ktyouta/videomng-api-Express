-- CreateTable
CREATE TABLE "favorite_video_sort_master" (
    "id" VARCHAR(2) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "update_date" TIMESTAMPTZ NOT NULL,
    "delete_flg" CHAR(1) NOT NULL DEFAULT '0',

    CONSTRAINT "favorite_video_sort_master_pkey" PRIMARY KEY ("id")
);
