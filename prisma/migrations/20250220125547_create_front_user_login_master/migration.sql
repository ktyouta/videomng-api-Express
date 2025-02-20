-- CreateTable
CREATE TABLE "TestConnection" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "TestConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "front_user_login_master" (
    "userId" VARCHAR(36) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "deleteFlg" CHAR(1) NOT NULL,

    CONSTRAINT "front_user_login_master_pkey" PRIMARY KEY ("userId")
);
