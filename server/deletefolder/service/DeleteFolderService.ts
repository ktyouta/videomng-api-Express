import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { DeleteFolderRepositoryInterface } from "../repository/interface/DeleteFolderRepositoryInterface";
import { Prisma } from "@prisma/client";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { DeleteFolderEntity } from "../entity/DeleteFolderEntity";
import { DeleteFavoriteVideoFolderEntity } from "../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFavoriteVideoEntity } from "../entity/DeleteFavoriteVideoEntity";


export class DeleteFolderService {

    constructor(private readonly deleteFolderRepositoryInterface: DeleteFolderRepositoryInterface) { }

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
            throw Error(`フォルダー更新時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * フォルダーを削除する
     * @returns 
     */
    async deleteFolder(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const entity = new DeleteFolderEntity(
            folderIdModel,
            frontUserIdModel,
        );

        // 削除
        const folder = await this.deleteFolderRepositoryInterface.deleteFolder(entity, tx);

        return folder;
    }

    /**
     * お気に入り動画フォルダーを削除する
     * @returns 
     */
    async deleteFavoriteVideoFolder(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const entity = new DeleteFavoriteVideoFolderEntity(
            folderIdModel,
            frontUserIdModel,
        );

        // 削除
        const folder = await this.deleteFolderRepositoryInterface.deleteVideoFolder(entity, tx);

        return folder;
    }

    /**
     * お気に入り動画を削除する
     * @returns 
     */
    async deleteFavoriteVideo(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const entity = new DeleteFavoriteVideoEntity(
            folderIdModel,
            frontUserIdModel,
        );

        // 削除
        const folder = await this.deleteFolderRepositoryInterface.deleteFavoriteVideo(entity, tx);

        return folder;
    }
}