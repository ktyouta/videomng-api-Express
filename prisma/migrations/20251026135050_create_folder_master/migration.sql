-- CreateTable
CREATE TABLE "folder_master" (
    "user_id" INTEGER NOT NULL,
    "folder_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "update_date" TIMESTAMPTZ NOT NULL,
    "delete_flg" CHAR(1) NOT NULL DEFAULT '0',

    CONSTRAINT "folder_master_pkey" PRIMARY KEY ("user_id","folder_id")
);
