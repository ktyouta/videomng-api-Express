import { FolderMaster } from "@prisma/client";
import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { ParentFolderIdModel } from "../../../internaldata/foldermaster/model/ParentFolderIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
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
    async selectFolderList(frontUserIdModel: FrontUserIdModel, parentFolderId: ParentFolderIdModel): Promise<FolderMaster[]> {

        const userId = frontUserIdModel.frontUserId;
        const parentId = parentFolderId.id;

        const result = await PrismaClientInstance.getInstance().folderMaster.findMany({
            where: {
                userId,
                parentId: parentId,
            }
        });

        return result;
    }
}