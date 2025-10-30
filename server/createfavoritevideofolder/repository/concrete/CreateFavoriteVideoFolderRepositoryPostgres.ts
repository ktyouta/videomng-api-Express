import { FavoriteVideoFolderTransaction, FavoriteVideoTagTransaction, FavoriteVideoTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { CreateFavoriteVideoFolderInterface } from "../interface/CreateFavoriteVideoFolderInterface";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { FLG } from "../../../util/const/CommonConst";
import { InsertFavoriteVideoFolderEntity } from "../../entity/InsertFavoriteVideoFolderEntity";
import { SelectFavoriteVideoEntity } from "../../entity/SelectFavoriteVideoEntity";



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
}