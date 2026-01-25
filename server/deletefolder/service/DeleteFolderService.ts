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
        await this.deleteFolderRepositoryInterface.deleteFavoriteVideo(entity, tx);
    }

    /**
     * お気に入り動画メモを削除する
     * @returns 
     */
    async deleteFavoriteVideoMemo(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 削除
        await this.deleteFolderRepositoryInterface.deleteFavoriteVideoMemo(frontUserIdModel, folderIdModel, tx);
    }

    /**
     * お気に入りコメントを削除する
     * @returns 
     */
    async deleteFavoriteComment(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 削除
        await this.deleteFolderRepositoryInterface.deleteFavoriteComment(frontUserIdModel, folderIdModel, tx);
    }

    /**
     * ブロックコメント削除
     * @returns 
     */
    async deleteBlockComment(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 削除
        await this.deleteFolderRepositoryInterface.deleteBlockComment(frontUserIdModel, folderIdModel, tx);
    }

    /**
     * お気に入り動画タグ削除
     * @returns 
     */
    async deleteFavoriteVideoTag(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 削除
        await this.deleteFolderRepositoryInterface.deleteFavoriteVideoTag(frontUserIdModel, folderIdModel, tx);
    }

    /**
     * お気に入り動画タグ削除
     * @returns 
     */
    async deleteTagMaster(frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 削除
        await this.deleteFolderRepositoryInterface.deleteTagMaster(frontUserIdModel, tx);
    }
}