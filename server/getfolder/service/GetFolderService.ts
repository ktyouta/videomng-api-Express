import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";
import { GetFolderRepositoryInterface } from "../repository/interface/GetFolderInterface";


export class GetFolderService {

    constructor(private readonly getFolderRepositoryInterface: GetFolderRepositoryInterface) { }

    /**
     * フォルダを取得
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getFolder(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const entity = new SelectFolderEntity(
            folderIdModel,
            frontUserIdModel
        );

        const folderList = await this.getFolderRepositoryInterface.selectFolder(entity);

        return folderList;
    }
}