import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { TagNameModel } from "../../../internaldata/tagmaster/properties/TagNameModel";
import { SelectDuplicationFolderEntity } from "../../entity/SelectDuplicationFolderEntity";
import { FolderNextSeqType } from "../../type/FolderNextSeqType";
import { UpdateFolderEntity } from "../../entity/UpdateFolderEntity";
import { FLG } from "../../../util/const/CommonConst";
import { UpdateFolderRepositoryInterface } from "../interface/UpdateFolderInterface";
import { SelectExistsFolderEntity } from "../../entity/SelectExistsFolderEntity";



/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFolderRepositoryPostgres implements UpdateFolderRepositoryInterface {

    constructor() {
    }

    /**
     * フォルダ存在チェック
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectExistsFolder(entity: SelectExistsFolderEntity): Promise<FolderMaster[]> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        const folderList = await PrismaClientInstance.getInstance().folderMaster.findMany({
            where: {
                userId,
                folderId
            },
        });

        return folderList;
    }

    /**
     * フォルダ重複チェック
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectDuplicationFolder(entity: SelectDuplicationFolderEntity): Promise<FolderMaster[]> {

        const userId = entity.frontUserId;
        const folderName = entity.folderName;

        const folderList = await PrismaClientInstance.getInstance().folderMaster.findMany({
            where: {
                userId,
                name: folderName
            },
        });

        return folderList;
    }

    /**
     * フォルダを更新
     */
    async update(insertFolderEntity: UpdateFolderEntity,
        tx: Prisma.TransactionClient): Promise<FolderMaster> {

        const userId = insertFolderEntity.frontUserId;
        const folderId = insertFolderEntity.folderId;
        const folderName = insertFolderEntity.folderName;

        const folder = tx.folderMaster.update({
            where: {
                userId_folderId: {
                    userId,
                    folderId
                }
            },
            data: {
                name: folderName,
                updateDate: new Date(),
            },
        });

        return folder;
    };
}