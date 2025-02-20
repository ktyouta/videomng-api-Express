-- CreateTable
CREATE TABLE "favarite_movie_transaction" (
    "user_id" VARCHAR(36) NOT NULL,
    "movie_id" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "delete_flg" CHAR(1) NOT NULL,

    CONSTRAINT "favarite_movie_transaction_pkey" PRIMARY KEY ("user_id")
);
