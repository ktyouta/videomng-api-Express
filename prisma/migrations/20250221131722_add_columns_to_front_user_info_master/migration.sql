/*
  Warnings:

  - Added the required column `user_birthday` to the `front_user_info_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "front_user_info_master" ADD COLUMN     "user_birthday" CHAR(8) NOT NULL;
