import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFolderListRepositoryInterface } from "../interface/GetFolderListInterface";
import { SelectFolderListEntity } from "../../entity/SelectFolderListEntity";


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