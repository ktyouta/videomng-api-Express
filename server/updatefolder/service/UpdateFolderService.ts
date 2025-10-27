import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { UpdateFolderRequestType } from "../schema/UpdateFolderRequestSchema";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { SelectExistsFolderEntity } from "../entity/SelectExistsFolderEntity";
import { UpdateFolderRepositoryInterface } from "../repository/interface/UpdateFolderInterface";
import { Prisma } from "@prisma/client";
import { UpdateFolderEntity } from "../entity/UpdateFolderEntity";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { FolderNameModel } from "../../internaldata/foldermaster/model/FolderNameModel";
import { SelectDuplicationFolderEntity } from "../entity/SelectDuplicationFolderEntity";


export class UpdateFolderService {

    constructor(private readonly updateFolderRepositoryInterface: UpdateFolderRepositoryInterface) { }

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
     * フォルダの存在チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getExistsFolder(folderIdModel: FolderIdModel,
        frontUserIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const entity = new SelectExistsFolderEntity(
            folderIdModel,
            frontUserIdModel
        );

        const folderList = await this.updateFolderRepositoryInterface.selectExistsFolder(entity);

        return folderList;
    }

    /**
     * フォルダの重複チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    async getDuplicationFolder(folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const entity = new SelectDuplicationFolderEntity(
            folderNameModel,
            frontUserIdModel
        );

        const folderList = await this.updateFolderRepositoryInterface.selectDuplicationFolder(entity);

        return folderList;
    }

    /**
     * フォルダーを更新する
     * @returns 
     */
    async update(folderIdModel: FolderIdModel,
        folderNameModel: FolderNameModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const entity = new UpdateFolderEntity(
            folderIdModel,
            folderNameModel,
            frontUserIdModel,
        );

        // 更新
        const folder = await this.updateFolderRepositoryInterface.update(entity, tx);

        return folder;
    }
}