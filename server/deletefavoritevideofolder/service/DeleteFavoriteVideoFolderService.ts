import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { DeleteFavoriteVideoFolderInterface } from "../repository/interface/DeleteFavoriteVideoFolderInterface";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { DeleteFavoriteVideoFolderEntity } from "../entity/DeleteFavoriteVideoFolderEntity";


export class DeleteFavoriteVideoFolderService {

    constructor(private readonly deleteFavoriteVideoFolderInterface: DeleteFavoriteVideoFolderInterface) { }

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    checkJwtVerify(req: Request) {

        try {

            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`お気に入り動画登録時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * お気に入り動画フォルダから削除
     * @param userNameModel 
     */
    async delete(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient) {

        const entity = new DeleteFavoriteVideoFolderEntity(folderIdModel, videoIdModel, frontUserIdModel);

        // 削除
        const result = await this.deleteFavoriteVideoFolderInterface.delete(entity, tx);

        return result;
    }
}