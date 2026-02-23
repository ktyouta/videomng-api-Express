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
    async selectFolder(entity: SelectFolderEntity): Promise<FolderMaster[]> {

        const userId = entity.frontUserId;
        const folderName = entity.folderName;
        const parentFolderId = entity.parentFolderId;

        const folderList = await PrismaClientInstance.getInstance().$queryRaw<FolderMaster[]>`
            SELECT
                id,
                name,
                parent_id as "parentId",
                user_id as "userId",
                folder_color as "folderColor"
            FROM
                folder_master fm
            WHERE
                fm.user_id = ${userId} AND
                fm.name = ${folderName} AND
                (
                    (
                        ${parentFolderId}::integer IS NULL AND
                        fm.parent_id IS NULL
                    )    
                        OR
                    (
                        fm.parent_id = ${parentFolderId} AND
                        EXISTS(
                            SELECT
                                1
                            FROM
                                folder_master tmp_fm
                            WHERE
                                tmp_fm.user_id = ${userId} AND
                                tmp_fm.id = ${parentFolderId}
                        )
                    )
                )
        `;

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