import { FavoriteVideoTransaction, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { CreateFavoriteVideoFolderInterface } from "../repository/interface/CreateFavoriteVideoFolderInterface";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { SelectFavoriteVideoEntity } from "../entity/SelectFavoriteVideoEntity";


export class CreateFavoriteVideoFolderService {

    constructor(private readonly createFavoriteVideoFolderInterface: CreateFavoriteVideoFolderInterface) { }

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
            throw Error(`お気に入り動画登録時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * フォルダの存在チェック
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

        const folderList = await this.createFavoriteVideoFolderInterface.selectFolder(entity);

        return folderList;
    }

    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideo(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel) {

        // お気に入り動画取得用Entity
        const entity = new SelectFavoriteVideoEntity(videoIdModel, frontUserIdModel);

        // お気に入り動画取得
        const favoriteVideoDetial = await this.createFavoriteVideoFolderInterface.selectFavoriteVideo(entity);

        return favoriteVideoDetial;
    }
}