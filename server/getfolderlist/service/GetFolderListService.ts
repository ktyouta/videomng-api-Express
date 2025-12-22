import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { SelectFolderListEntity } from "../entity/SelectFolderListEntity";
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
    async getFolderList(userIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const entity = new SelectFolderListEntity(userIdModel);

        const result = await this.getFolderRepositoryInterface.selectFolderList(entity);

        return result;
    }
}