import { FavoriteVideoFolderTransaction, FavoriteVideoTransaction, FolderMaster, Prisma } from "@prisma/client";
import { FLG } from "../../../common/const/CommonConst";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { InsertFavoriteVideoFolderEntity } from "../../entity/InsertFavoriteVideoFolderEntity";
import { SelectFavoriteVideoEntity } from "../../entity/SelectFavoriteVideoEntity";
import { SelectFavoriteVideoFolderEntity } from "../../entity/SelectFavoriteVideoFolderEntity";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { CreateFavoriteVideoFolderInterface } from "../interface/CreateFavoriteVideoFolderInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateFavoriteVideoFolderRepositoryPostgres implements CreateFavoriteVideoFolderInterface {

    constructor() {
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
                userId_folderId: {
                    userId,
                    folderId
                }
            },
        });

        return folderList;
    }

    /**
     * フォルダー取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectFavoriteVideo(selectFavoriteVideoEntity: SelectFavoriteVideoEntity): Promise<FavoriteVideoTransaction | null> {

        const userId = selectFavoriteVideoEntity.frontUserId;
        const videoId = selectFavoriteVideoEntity.videoId;

        const video = await PrismaClientInstance.getInstance().favoriteVideoTransaction.findUnique({
            where: {
                userId_videoId: {
                    userId,
                    videoId,
                },
                deleteFlg: FLG.OFF,
            },
        });

        return video;
    }

    /**
     * お気に入り動画フォルダ登録
     */
    async insert(insertFolderEntity: InsertFavoriteVideoFolderEntity,
        tx: Prisma.TransactionClient): Promise<FavoriteVideoFolderTransaction> {

        const userId = insertFolderEntity.frontUserId;
        const folderId = insertFolderEntity.folderId;
        const videoId = insertFolderEntity.videoId;

        const data = await tx.favoriteVideoFolderTransaction.create({
            data: {
                userId,
                folderId,
                videoId,
                createDate: new Date(),
                updateDate: new Date(),
            },
        });

        return data;
    };

    /**
     * フォルダ内のお気に入り動画取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectFavoriteVideoFolder(selectFavoriteVideoFolderEntity: SelectFavoriteVideoFolderEntity): Promise<FavoriteVideoFolderTransaction | null> {

        const userId = selectFavoriteVideoFolderEntity.frontUserId;
        const folderId = selectFavoriteVideoFolderEntity.folderId;
        const videoId = selectFavoriteVideoFolderEntity.videoId;

        const video = await PrismaClientInstance.getInstance().favoriteVideoFolderTransaction.findUnique({
            where: {
                userId_folderId_videoId: {
                    userId,
                    videoId,
                    folderId,
                },
            },
        });

        return video;
    }
}