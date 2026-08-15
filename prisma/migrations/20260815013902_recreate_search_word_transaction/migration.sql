/*
  Warnings:

  - You are about to drop the `search_word_transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "search_word_transaction";

-- CreateTable
CREATE TABLE "recent_search_word_transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "update_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "recent_search_word_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frequent_search_word_transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "search_count" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "update_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "frequent_search_word_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recent_search_word_transaction_user_id_word_key" ON "recent_search_word_transaction"("user_id", "word");

-- CreateIndex
CREATE UNIQUE INDEX "frequent_search_word_transaction_user_id_word_key" ON "frequent_search_word_transaction"("user_id", "word");
