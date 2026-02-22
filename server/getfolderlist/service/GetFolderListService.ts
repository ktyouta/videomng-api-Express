import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { ParentFolderIdModel } from "../../internaldata/foldermaster/model/ParentFolderIdModel";
import { GetFolderListRepositoryInterface } from "../repository/interface/GetFolderListInterface";


export class GetFolderService {

    constructor(private readonly getFolderRepositoryInterface: GetFolderListRepositoryInterface) { }

    /**
     * フォルダを取得
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getFolderList(userIdModel: FrontUserIdModel, parentFolderId: ParentFolderIdModel) {
        const result = await this.getFolderRepositoryInterface.selectFolderList(userIdModel, parentFolderId);
        return result;
    }
}