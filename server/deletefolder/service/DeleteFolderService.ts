import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { DeleteFavoriteVideoEntity } from "../entity/DeleteFavoriteVideoEntity";
import { DeleteFavoriteVideoFolderEntity } from "../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFolderEntity } from "../entity/DeleteFolderEntity";
import { DeleteFolderRepositoryInterface } from "../repository/interface/DeleteFolderRepositoryInterface";


export class DeleteFolderService {

    constructor(private readonly deleteFolderRepositoryInterface: DeleteFolderRepositoryInterface) { }

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