import { FavoriteVideoFolderTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { FLG } from "../../../constant/CommonConst";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { InsertFavoriteVideoFolderEntity } from "../../entity/InsertFavoriteVideoFolderEntity";
import { InsertFavoriteVideoTagEntity } from "../../entity/InsertFavoriteVideoTagEntity";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { SelectTagMasterEntity } from "../../entity/SelectTagMasterEntity";
import { CreateFavoriteVideoRepositoryInterface } from "../interface/CreateFavoriteVideoRepositoryInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateFavoriteVideoRepositoryPostgres implements CreateFavoriteVideoRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入り動画タグを登録
     */
    async insertVideoTag(entity: InsertFavoriteVideoTagEntity, tx: Prisma.TransactionClient) {
        const userId = entity.frontUserId;
        const videoId = entity.videoId;
        const tagId = entity.tagId;

        const favoriteVideoTag = await tx.favoriteVideoTagTransaction.create({
            data: {
                userId,
                videoId,
                tagId,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return favoriteVideoTag;
    }

    /**
     * フォルダー取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectFolder(selectFolderEntity: SelectFolderEntity): Promise<FolderMaster | null> {

        const userId = selectFolderEntity.frontUserId;
        const folderId = selectFolderEntity.folderId;

        const folderList = await PrismaClientInstance.getInstance().folderMaster.findUnique({
            where: {
                userId,
                id: folderId
            },
        });

        return folderList;
    }

    /**
     * タグマスタ取得
     * @param selectTagMasterEntity
     */
    async selectTagMaster(selectTagMasterEntity: SelectTagMasterEntity): Promise<TagMaster[]> {

        const userId = selectTagMasterEntity.frontUserId;
        const tagIdList = selectTagMasterEntity.tagIdList;

        const tagMasterList = await PrismaClientInstance.getInstance().tagMaster.findMany({
            where: {
                userId,
                tagId: {
                    in: tagIdList
                },
            },
        });

        return tagMasterList;
    }

    /**
     * お気に入り動画フォルダ登録
     */
    async insertFavoriteFolder(insertFolderEntity: InsertFavoriteVideoFolderEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoFolderTransaction> {

        const folderId = insertFolderEntity.folderId;
        const videoId = insertFolderEntity.videoId;

        const data = await tx.favoriteVideoFolderTransaction.create({
            data: {
                folderMasterId: folderId,
                videoId,
                createDate: new Date(),
                updateDate: new Date(),
            },
        });

        return data;
    };
}