-- AlterTable
ALTER TABLE "block_commnet_transaction" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "favorite_commnet_transaction" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "favorite_video_category_transaction" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "favorite_video_memo_transaction" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "favorite_video_tag_transaction" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "favorite_video_transaction" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "front_user_info_master" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "front_user_login_master" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "tag_master" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "view_status_master" ALTER COLUMN "create_date" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "update_date" SET DATA TYPE TIMESTAMPTZ;
