/*
  Warnings:

  - The primary key for the `front_user_login_master` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createDate` on the `front_user_login_master` table. All the data in the column will be lost.
  - You are about to drop the column `deleteFlg` on the `front_user_login_master` table. All the data in the column will be lost.
  - You are about to drop the column `updateDate` on the `front_user_login_master` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `front_user_login_master` table. All the data in the column will be lost.
  - Added the required column `create_date` to the `front_user_login_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delete_flg` to the `front_user_login_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_date` to the `front_user_login_master` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `front_user_login_master` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "front_user_login_master" DROP CONSTRAINT "front_user_login_master_pkey",
DROP COLUMN "createDate",
DROP COLUMN "deleteFlg",
DROP COLUMN "updateDate",
DROP COLUMN "userId",
ADD COLUMN     "create_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "delete_flg" CHAR(1) NOT NULL,
ADD COLUMN     "update_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" VARCHAR(36) NOT NULL,
ADD CONSTRAINT "front_user_login_master_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "front_user_info_master" (
    "user_id" VARCHAR(36) NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,
    "delete_flg" CHAR(1) NOT NULL,

    CONSTRAINT "front_user_info_master_pkey" PRIMARY KEY ("user_id")
);
