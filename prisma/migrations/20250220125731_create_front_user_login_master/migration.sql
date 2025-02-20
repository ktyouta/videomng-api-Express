/*
  Warnings:

  - You are about to drop the `TestConnection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TestConnection";

-- CreateTable
CREATE TABLE "test_connection" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "test_connection_pkey" PRIMARY KEY ("id")
);
