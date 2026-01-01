import { FolderMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SelectFolderListEntity } from "../../entity/SelectFolderListEntity";
import { GetFolderListRepositoryInterface } from "../interface/GetFolderListInterface";


/**
 * json形式の永続ロジック用クラス
 */
export class GetFolderListRepositoryPostgres implements GetFolderListRepositoryInterface {

    constructor() {
    }

    /**
     * フォルダ取得
     * @param frontFavoriteVideoTagInfoMasterModel 
     * @returns 
     */
    async selectFolderList(entity: SelectFolderListEntity): Promise<FolderMaster[]> {

        const userId = entity.frontUserId;

        const result = await PrismaClientInstance.getInstance().folderMaster.findMany({
            where: {
                userId
            }
        });

        return result;
    }
}