import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { CreateFolderRequestType } from "../schema/CreateFolderRequestSchema";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";
import { CreateFolderRepositoryInterface } from "../repository/interface/CreateFolderInterface";
import { Prisma } from "@prisma/client";
import { InsertFolderEntity } from "../entity/InsertFolderEntity";
import { FolderIdModel } from "../model/FolderIdModel";
import { FolderNameModel } from "../model/FolderNameModel";


export class CreateFolderService {

    constructor(private readonly createFolderRepositoryInterface: CreateFolderRepositoryInterface) { }

    /**
     * jwtからユーザー情報を取得
     * @param jwt 
     * @returns 
     */
    public checkJwtVerify(req: Request) {

        try {
            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);
            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`フォルダー登録時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * フォルダの存在チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async getFolder(requestBody: CreateFolderRequestType,
        frontUserIdModel: FrontUserIdModel) {

        // フォルダ取得Entity
        const selectFolderEntity = new SelectFolderEntity(
            requestBody,
            frontUserIdModel
        );

        const folderList = await this.createFolderRepositoryInterface.selectFolder(selectFolderEntity);

        return folderList;
    }

    /**
     * フォルダーを登録する
     * @returns 
     */
    public async createFolder(requestBody: CreateFolderRequestType,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // フォルダIDを取得
        const nextTagIdList = await this.createFolderRepositoryInterface.getFolderNextSeq(frontUserIdModel);
        const nextTagId = nextTagIdList[0].nextSeq;

        const insertFolderEntity = new InsertFolderEntity(
            new FolderIdModel(nextTagId),
            new FolderNameModel(requestBody.name),
            frontUserIdModel,
        );

        // 登録
        const folder = await this.createFolderRepositoryInterface.insert(insertFolderEntity, tx);

        return folder;
    }
}