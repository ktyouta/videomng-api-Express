-- CreateTable
CREATE TABLE "block_commnet_transaction" (
    "user_id" INTEGER NOT NULL,
    "comment_id" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "delete_flg" CHAR(1) NOT NULL,

    CONSTRAINT "block_commnet_transaction_pkey" PRIMARY KEY ("user_id","comment_id")
);
