import { JsonFileData } from "../../../util/service/JsonFileData";
import { CreateFavoriteCommentSelectEntity } from "../../entity/CreateFavoriteCommentSelectEntity";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FavoriteCommentTransaction } from "@prisma/client";
import { CreateFavoriteCommentRepositoryInterface } from "../interface/CreateFavoriteCommentRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateFavoriteCommentRepositoryPostgres implements CreateFavoriteCommentRepositoryInterface {

    constructor() {
    }


    /**
     * お気に入りコメント情報取得
     * @param frontFavoriteCommentInfoMasterModel 
     * @returns 
     */
    public async select(createFavoriteCommentSelectEntity: CreateFavoriteCommentSelectEntity): Promise<FavoriteCommentTransaction[]> {

        const userId = createFavoriteCommentSelectEntity.frontUserId;
        const commentId = createFavoriteCommentSelectEntity.commentId;

        const favoriteCommentList = await PrismaClientInstance.getInstance().$queryRaw<FavoriteCommentTransaction[]>`
            SELECT * 
            FROM "favorite_commnet_transaction" 
            WHERE user_id = CAST(${userId} AS INTEGER) AND
            comment_id = ${commentId}
        `;

        return favoriteCommentList;
    }

}