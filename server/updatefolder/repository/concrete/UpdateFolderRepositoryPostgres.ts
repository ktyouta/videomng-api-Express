import { FolderMaster, Prisma } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SelectDuplicationFolderEntity } from "../../entity/SelectDuplicationFolderEntity";
import { SelectExistsFolderEntity } from "../../entity/SelectExistsFolderEntity";
import { UpdateFolderEntity } from "../../entity/UpdateFolderEntity";
import { UpdateFolderRepositoryInterface } from "../interface/UpdateFolderInterface";



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
                id: folderId
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
        const folderColor = insertFolderEntity.folderColor;

        const folder = tx.folderMaster.update({
            where: {
                userId,
                id: folderId
            },
            data: {
                name: folderName,
                folderColor,
                updateDate: new Date(),
            },
        });

        return folder;
    };
}