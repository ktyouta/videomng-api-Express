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
                fm.id,
                fm.name,
                fm.parent_id as "parentId",
                fm.user_id as "userId",
                fm.folder_color as "folderColor"
            FROM 
                folder_master fm
            INNER JOIN
                folder_master tmp_fm
            ON
                fm.user_id = tmp_fm.user_id AND
                (
                    (
                        fm.parent_id IS NULL AND 
                        tmp_fm.parent_id IS NULL
                    )
                        OR
                    fm.parent_id = tmp_fm.parent_id
                )
            WHERE 
                fm.user_id = $1 AND
                tmp_fm.name = $2 AND
                fm.id = $3 AND
                fm.id <> tmp_fm.id
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