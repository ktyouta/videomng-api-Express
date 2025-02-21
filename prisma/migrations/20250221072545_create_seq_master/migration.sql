/*
  Warnings:

  - The primary key for the `favarite_movie_transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `front_user_info_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `front_user_login_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `user_id` on the `favarite_movie_transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `front_user_info_master` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `front_user_login_master` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "favarite_movie_transaction" DROP CONSTRAINT "favarite_movie_transaction_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "favarite_movie_transaction_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "front_user_info_master" DROP CONSTRAINT "front_user_info_master_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "front_user_info_master_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "front_user_login_master" DROP CONSTRAINT "front_user_login_master_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "front_user_login_master_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "seq_master" (
    "key" VARCHAR(1000) NOT NULL,
    "nextId" INTEGER NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seq_master_pkey" PRIMARY KEY ("key")
);
