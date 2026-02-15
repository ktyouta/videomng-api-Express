import { FolderMaster, Prisma } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { InsertFolderEntity } from "../../entity/InsertFolderEntity";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { CreateFolderRepositoryInterface } from "../interface/CreateFolderInterface";



/**
 * json形式の永続ロジック用クラス
 */
export class CreateFolderRepositoryPostgres implements CreateFolderRepositoryInterface {

    constructor() {
    }


    /**
     * フォルダー取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectFolder(selectFolderEntity: SelectFolderEntity): Promise<FolderMaster[]> {

        const userId = selectFolderEntity.frontUserId;
        const folderName = selectFolderEntity.folderName;
        const parentFolderId = selectFolderEntity.parentFolderId;

        const folderList = await PrismaClientInstance.getInstance().folderMaster.findMany({
            where: {
                userId,
                name: folderName,
                parentId: parentFolderId,
            },
        });

        return folderList;
    }

    /**
     * フォルダを作成
     */
    async insert(insertFolderEntity: InsertFolderEntity,
        tx: Prisma.TransactionClient): Promise<FolderMaster> {

        const userId = insertFolderEntity.frontUserId;
        const folderName = insertFolderEntity.folderName;
        const folderColor = insertFolderEntity.folderColor;
        const parentFolderId = insertFolderEntity.parentFolderId;

        const folder = await tx.folderMaster.create({
            data: {
                userId,
                name: folderName,
                folderColor,
                parentId: parentFolderId,
                createDate: new Date(),
                updateDate: new Date(),
            },
        });

        return folder;
    };
}