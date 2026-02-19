import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
import { FolderListType } from "../../types/FolderListType";
import { GetFolderRepositoryInterface } from "../interface/GetFolderInterface";


/**
 * json形式の永続ロジック用クラス
 */
export class GetFolderRepositoryPostgres implements GetFolderRepositoryInterface {

    constructor() {
    }

    /**
     * フォルダ取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectFolder(entity: SelectFolderEntity): Promise<FolderListType[]> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;
        const params = [];
        params.push(userId);
        params.push(folderId);

        let sql = `
            WITH RECURSIVE folder_tree AS (
                SELECT 
                    id,
                    name,
                    folder_color,
                    parent_id
                FROM 
                    folder_master
                WHERE 
                    user_id = $1 AND
                    id = $2

                UNION ALL

                SELECT 
                    f.id,
                    f.name,
                    f.folder_color,
                    f.parent_id
                FROM 
                    folder_master f
                INNER JOIN 
                    folder_tree ft
                ON 
                    f.user_id = $1 AND
                    f.id = ft.parent_id
            )

            SELECT
                id,
                name,
                folder_color as "folderColor"
            FROM
                folder_tree
            ORDER BY
                id
        `;

        const folderList = await PrismaClientInstance.getInstance().$queryRawUnsafe<FolderListType[]>(sql, ...params);
        return folderList;
    }
}