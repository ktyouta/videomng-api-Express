import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { GetFolderListRepositoryInterface } from "../repository/interface/GetFolderListInterface";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { SelectFolderListEntity } from "../entity/SelectFolderListEntity";


export class GetFolderService {

    constructor(private readonly getFolderRepositoryInterface: GetFolderListRepositoryInterface) { }

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    checkJwtVerify(req: Request) {

        try {
            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);
            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`フォルダー更新時の認証エラー ERROR:${err}`);
        }
    }

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