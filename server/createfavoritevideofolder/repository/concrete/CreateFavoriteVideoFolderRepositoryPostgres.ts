import { FavoriteVideoTagTransaction, FavoriteVideoTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { CreateFavoriteVideoFolderInterface } from "../interface/CreateFavoriteVideoFolderInterface";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { FLG } from "../../../util/const/CommonConst";
import { InsertFolderEntity } from "../../entity/InsertFolderEntity";
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
     * フォルダを作成
     */
    async insert(insertFolderEntity: InsertFolderEntity,
        tx: Prisma.TransactionClient): Promise<FolderMaster> {

        const userId = insertFolderEntity.frontUserId;
        const folderId = insertFolderEntity.folderId;
        const folderName = insertFolderEntity.folderName;

        const folder = await tx.folderMaster.create({
            data: {
                userId,
                folderId,
                name: folderName,
                createDate: new Date(),
                updateDate: new Date(),
            },
        });

        return folder;
    };
}