/*
  Warnings:

  - Added the required column `salt` to the `front_user_login_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "front_user_login_master" ADD COLUMN     "salt" VARCHAR(32) NOT NULL;
