-- CreateTable
CREATE TABLE "tag_master" (
    "user_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "tag_name" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "delete_flg" CHAR(1) NOT NULL,

    CONSTRAINT "tag_master_pkey" PRIMARY KEY ("user_id","tag_id")
);
