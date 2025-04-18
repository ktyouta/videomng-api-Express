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
import { UpdateFavoriteVideoTagFavoriteVideoSelectEntity } from "../entity/UpdateFavoriteVideoTagFavoriteVideoSelectEntity";
import { TagMasterRepositorys } from "../../internaldata/tagmaster/repository/TagMasterRepositorys";
import { TagMasterRepositoryInterface } from "../../internaldata/tagmaster/repository/interface/TagMasterRepositoryInterface";
import { FavoriteVideoTagTransactionRepositoryInterface } from "../../internaldata/favoritevideotagtransaction/repository/interface/FavoriteVideoTagTransactionRepositoryInterface";
import { FavoriteVideoTagTransactionRepositorys } from "../../internaldata/favoritevideotagtransaction/repository/FavoriteVideoTagTransactionRepositorys";
import { FavoriteVideoTagTransaction, Prisma } from "@prisma/client";
import { FavoriteVideoTagTransactionInsertEntity } from "../../internaldata/favoritevideotagtransaction/entity/FavoriteVideoTagTransactionInsertEntity";
import { UpdateFavoriteVideoTagResponseDataType } from "../type/UpdateFavoriteVideoTagResponseDataType";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";
import { UpdateFavoriteVideoTagType } from "../type/UpdateFavoriteVideoTagType";
import { UpdateFavoriteVideoTagModel } from "../type/UpdateFavoriteVideoTagModel";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { TagMasterInsertEntity } from "../../internaldata/tagmaster/entity/TagMasterInsertEntity";


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
            throw Error(`お気に入り動画タグ更新時の認証エラー ERROR:${err}`);
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
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await favoriteVideoTagCategoryRepository.delete(
            updateFavoriteVideoTagRequestModel.frontUserIdModel,
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
        updateTagMasterList: UpdateFavoriteVideoTagModel[],
        updateFavoriteVideoTagRequestModel: UpdateFavoriteVideoTagRequestModel,
        tx: Prisma.TransactionClient) {

        const categoryList: UpdateFavoriteVideoTagResponseDataType[] = await Promise.all(updateTagMasterList.map(async (e) => {

            const insertTag = await favoriteVideoTagCategoryRepository.insert(
                new FavoriteVideoTagTransactionInsertEntity(
                    updateFavoriteVideoTagRequestModel.frontUserIdModel,
                    updateFavoriteVideoTagRequestModel.videoIdModel,
                    e.tagIdModel,
                ), tx);

            return { ...insertTag, tagName: e.tagNameModel.tagName }
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
        updateFavoriteVideoTagRequestModel: UpdateFavoriteVideoTagRequestModel,) {

        // お気に入り動画取得Entity
        const updateFavoriteVideoTagSelectEntity = new UpdateFavoriteVideoTagFavoriteVideoSelectEntity(
            updateFavoriteVideoTagRequestModel.frontUserIdModel,
            updateFavoriteVideoTagRequestModel.videoIdModel
        );

        // お気に入り動画を取得
        const favoriteVideoTagList = await getUpdateFavoriteVideoTagRepository.selectFavoriteVideo(updateFavoriteVideoTagSelectEntity);

        return favoriteVideoTagList.length > 0;
    }


    /**
     * タグマスタにタグを追加する
     * @returns 
     */
    public async addTagMaster(tagMasterRepository: TagMasterRepositoryInterface,
        getUpdateFavoriteVideoTagRepository: UpdateFavoriteVideoTagRepositoryInterface,
        updateFavoriteVideoTagRequestModel: UpdateFavoriteVideoTagRequestModel,
        tx: Prisma.TransactionClient) {

        const updateTagList: UpdateFavoriteVideoTagModel[] = [];
        const tagList = updateFavoriteVideoTagRequestModel.tagList;
        const userIdModel = updateFavoriteVideoTagRequestModel.frontUserIdModel;

        // 行番号を取得
        const nextTagIdList = await getUpdateFavoriteVideoTagRepository.selectTagSeq(userIdModel);
        let nextTagId = nextTagIdList[0].nextSeq;

        for (const tag of tagList) {

            const tagNameModel = new TagNameModel(tag.name);
            const tagList = await getUpdateFavoriteVideoTagRepository.selectTagMaster(tagNameModel);

            if (tagList && tagList.length > 0) {
                const tagInfo = tagList[0];
                const tagIdModel = new TagIdModel(tagInfo.tagId);
                const tagModel = new UpdateFavoriteVideoTagModel(tagIdModel, tagNameModel);

                updateTagList.push(tagModel);
                continue;
            }

            /** タグマスタに存在しない場合はマスタに登録する */
            const tagIdModel = new TagIdModel(nextTagId);

            // 登録
            const tagMasterInsertEntity = new TagMasterInsertEntity(userIdModel, tagIdModel, tagNameModel);
            await tagMasterRepository.insert(tagMasterInsertEntity, tx);

            const tagModel = new UpdateFavoriteVideoTagModel(tagIdModel, tagNameModel);
            updateTagList.push(tagModel);
            nextTagId++;
        }

        return updateTagList;
    }
}