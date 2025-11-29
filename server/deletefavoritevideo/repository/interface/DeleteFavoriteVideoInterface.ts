import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { DeleteFavoriteVideoEntity } from "../../../deletefolder/entity/DeleteFavoriteVideoEntity";
import { DeleteFavoriteVideoFolderEntity } from "../../entity/DeleteFavoriteVideoFolderEntity";


/**
 * 永続ロジック用インターフェース
 */
export interface DeleteFavoriteVideoInterface {

    /**
     * お気に入り動画フォルダから削除
     */
    deleteFavoriteVideoFolder(insertEntity: DeleteFavoriteVideoFolderEntity, tx: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
}