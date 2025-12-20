import { FavoriteVideoTransaction } from "@prisma/client";
import { Request } from 'express';
import { CookieModel } from "../../cookie/model/CookieModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { SelectShareVideoEntity } from "../entity/SelectShareVideoEntity";
import { FavoriteVideoListMergedType } from "../model/FavoriteVideoListMergedType";
import { FolderShareVideosResponseModel } from "../model/FolderShareVideosResponseModel";
import { FolderShareVideosRepositoryInterface } from "../repository/interface/FolderShareVideosRepositoryInterface";


export class FolderShareVideosService {

    constructor(private readonly getFavoriteVideoFolderRepository: FolderShareVideosRepositoryInterface) { }

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
            throw Error(`お気に入り動画リスト取得時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入り動画取得
     * @param userNameModel 
     */
    public async getFavoriteVideoFolder(getFavoriteVideoFolderSelectEntity: SelectShareVideoEntity): Promise<FavoriteVideoTransaction[]> {

        // お気に入り動画取得
        const favoriteVideos = await this.getFavoriteVideoFolderRepository.selectFavoriteVideoList(getFavoriteVideoFolderSelectEntity,);

        return favoriteVideos;
    }

    /**
     * レスポンスを作成
     * @param frontUserInfoCreateRequestBody 
     * @param newJsonWebTokenModel 
     */
    public createResponse(favoriteVideoListMergedList: FavoriteVideoListMergedType[]): FolderShareVideosResponseModel {
        return new FolderShareVideosResponseModel(favoriteVideoListMergedList);
    }
}