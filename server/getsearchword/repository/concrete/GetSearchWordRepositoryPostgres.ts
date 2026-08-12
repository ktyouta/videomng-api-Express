import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SearchWordType } from "../../types/SearchWordType";
import { GetSearchWordRepositoryInterface } from "../interface/GetSearchWordInterface";


/**
 * json形式の永続ロジック用クラス
 */
export class GetSearchWordRepositoryPostgres implements GetSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * 検索実績取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectSearchWord(frontUserIdModel: FrontUserIdModel): Promise<SearchWordType[]> {

        const userId = frontUserIdModel.frontUserId;
        const params = [];
        params.push(userId);

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
                folder_color as "folderColor",
                parent_id as "parentId"
            FROM
                folder_tree
            ORDER BY
                id
        `;

        const folderList = await PrismaClientInstance.getInstance().$queryRawUnsafe<SearchWordType[]>(sql, ...params);
        return folderList;
    }
}