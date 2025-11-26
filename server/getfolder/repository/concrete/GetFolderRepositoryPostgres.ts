import { FavoriteVideoTagTransaction, FolderMaster, Prisma, TagMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";
import { GetFolderRepositoryInterface } from "../interface/GetFolderInterface";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";


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
    async selectFolder(entity: SelectFolderEntity): Promise<FolderMaster | null> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        const folder = await PrismaClientInstance.getInstance().folderMaster.findUnique({
            where: {
                userId_folderId: {
                    userId,
                    folderId,
                },
            }
        });

        return folder;
    }
}