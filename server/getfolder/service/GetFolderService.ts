import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { GetFolderRepositoryInterface } from "../repository/interface/GetFolderInterface";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";


export class GetFolderService {

    constructor(private readonly getFolderRepositoryInterface: GetFolderRepositoryInterface) { }

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