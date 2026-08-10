-- CreateTable
CREATE TABLE "search_word_transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "search_count" INTEGER NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "update_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "search_word_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_search_word_transaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMPTZ NOT NULL,
    "update_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "favorite_search_word_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "search_word_transaction_user_id_word_key" ON "search_word_transaction"("user_id", "word");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_search_word_transaction_user_id_word_key" ON "favorite_search_word_transaction"("user_id", "word");
