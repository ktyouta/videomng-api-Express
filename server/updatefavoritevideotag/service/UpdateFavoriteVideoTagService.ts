import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoTagRequestModel } from "../model/UpdateFavoriteVideoTagRequestModel";
import { VideoMemoModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoModel";
import { VideoMemoSeqModel } from "../../internaldata/favoritevideomemotransaction/properties/VideoMemoSeqModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { UpdateFavoriteVideoTagRepositorys } from "../repository/UpdateFavoriteVideoTagRepositorys";
import { UpdateFavoriteVideoTagRepositoryInterface } from "../repository/interface/UpdateFavoriteVideoTagRepositoryInterface";
import { UpdateFavoriteVideoTagSelectEntity } from "../entity/UpdateFavoriteVideoTagSelectEntity";
import { TagMasterRepositorys } from "../../internaldata/tagmaster/repository/TagMasterRepositorys";
import { TagMasterRepositoryInterface } from "../../internaldata/tagmaster/repository/interface/TagMasterRepositoryInterface";
import { FavoriteVideoTagTransactionRepositoryInterface } from "../../internaldata/favoritevideotagtransaction/repository/interface/FavoriteVideoTagTransactionRepositoryInterface";
import { FavoriteVideoTagTransactionRepositorys } from "../../internaldata/favoritevideotagtransaction/repository/FavoriteVideoTagTransactionRepositorys";
import { FavoriteVideoTagTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoTagTransactionInsertEntity } from "../../internaldata/favoritevideotagtransaction/entity/FavoriteVideoTagTransactionInsertEntity";
import { FavoriteVideoTagType } from "../type/UpdateFavoriteVideoTagResponseDataType";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";


export class UpdateFavoriteVideoTagService {

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
            throw Error(`お気に入り動画更新時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * お気に入り動画更新の永続ロジックを取得
     * @returns 
     */
    public getUpdateFavoriteVideoTagRepository(): UpdateFavoriteVideoTagRepositoryInterface {
        return (new UpdateFavoriteVideoTagRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * タグマスタの永続ロジックを取得
     * @returns 
     */
    public getTagMasterRepository(): TagMasterRepositoryInterface {
        return (new TagMasterRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画タグの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoTagRepository(): FavoriteVideoTagTransactionRepositoryInterface {
        return (new FavoriteVideoTagTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画タグを削除する
     * @param favoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async deleteFavoriteVideoTag(favoriteVideoTagCategoryRepository: FavoriteVideoTagTransactionRepositoryInterface,
        updateFavoriteVideoTagRequestModel: UpdateFavoriteVideoTagRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await favoriteVideoTagCategoryRepository.delete(
            frontUserIdModel,
            updateFavoriteVideoTagRequestModel.videoIdModel,
            tx);
    }

    /**
     * お気に入り動画タグにデータを追加する
     * @param favoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     */
    public async insertFavoriteVideoTag(favoriteVideoTagCategoryRepository: FavoriteVideoTagTransactionRepositoryInterface,
        updateTagMasterList: FavoriteVideoTagType[],
        frontUserIdModel: FrontUserIdModel,
        videoId: VideoIdModel,
        tx: Prisma.TransactionClient) {

        const categoryList: FavoriteVideoTagTransaction[] = await Promise.all(updateTagMasterList.map((e) => {

            return favoriteVideoTagCategoryRepository.insert(
                new FavoriteVideoTagTransactionInsertEntity(
                    frontUserIdModel,
                    videoId,
                    new TagIdModel(e.tagId),
                ), tx);
        }));

        return categoryList;
    }


    /**
     * お気に入り動画の存在チェック
     * @param getUpdateFavoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @returns 
     */
    public async checkExistFavoriteVideoTag(getUpdateFavoriteVideoTagRepository: UpdateFavoriteVideoTagRepositoryInterface,
        updateFavoriteVideoTagRequestModel: UpdateFavoriteVideoTagRequestModel,
        frontUserIdModel: FrontUserIdModel
    ) {

        // お気に入り動画取得Entity
        const updateFavoriteVideoTagSelectEntity = new UpdateFavoriteVideoTagSelectEntity(
            frontUserIdModel,
            updateFavoriteVideoTagRequestModel.videoIdModel
        );

        // お気に入り動画を取得
        const favoriteVideoTagList = await getUpdateFavoriteVideoTagRepository.select(updateFavoriteVideoTagSelectEntity);

        return favoriteVideoTagList.length > 0;
    }


    /**
     * タグマスタにタグを追加する
     * @returns 
     */
    public async addTagMaster() {

        const updateTagList: FavoriteVideoTagType[] = [];
        return updateTagList;
    }
}