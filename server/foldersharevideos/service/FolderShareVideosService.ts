import { FavoriteVideoTransaction } from "@prisma/client";
import { SelectShareVideoEntity } from "../entity/SelectShareVideoEntity";
import { FavoriteVideoListMergedType } from "../model/FavoriteVideoListMergedType";
import { FolderShareVideosResponseModel } from "../model/FolderShareVideosResponseModel";
import { FolderShareVideosRepositoryInterface } from "../repository/interface/FolderShareVideosRepositoryInterface";


export class FolderShareVideosService {

    constructor(private readonly getFavoriteVideoFolderRepository: FolderShareVideosRepositoryInterface) { }

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