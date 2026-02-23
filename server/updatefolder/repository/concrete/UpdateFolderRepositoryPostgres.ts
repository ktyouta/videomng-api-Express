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

        const params = [];
        params.push(entity.frontUserId);
        params.push(entity.folderName);
        params.push(entity.folderId);

        let sql = `
            SELECT
                id,
                name,
                parent_id as "parentId",
                user_id as "userId",
                folder_color as "folderColor"
            FROM 
                folder_master fm
            WHERE 
                fm.user_id = $1 AND
                (
                    fm.id = $3
                        OR
                    (
                        fm.name = $2 
                            AND
                        fm.parent_id = (
                            SELECT
                                tmp_fm.parent_id
                            FROM
                                folder_master tmp_fm
                            WHERE
                                tmp_fm.id = $3 AND
                                tmp_fm.user_id = $1
                        )
                    )
                )
        `;

        const folderList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FolderMaster[]>(sql, ...params);
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