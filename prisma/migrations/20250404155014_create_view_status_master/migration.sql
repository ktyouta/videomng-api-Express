-- CreateTable
CREATE TABLE "view_status_master" (
    "id" VARCHAR(2) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "update_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "view_status_master_pkey" PRIMARY KEY ("id")
);
