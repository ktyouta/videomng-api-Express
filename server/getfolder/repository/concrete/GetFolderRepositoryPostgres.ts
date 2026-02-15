import { FolderMaster } from "@prisma/client";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { SelectFolderEntity } from "../../entity/SelectFolderEntity";
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
    async selectFolder(entity: SelectFolderEntity): Promise<FolderMaster | null> {

        const userId = entity.frontUserId;
        const folderId = entity.folderId;

        const folder = await PrismaClientInstance.getInstance().folderMaster.findUnique({
            where: {
                userId,
                id: folderId,
            }
        });

        return folder;
    }
}