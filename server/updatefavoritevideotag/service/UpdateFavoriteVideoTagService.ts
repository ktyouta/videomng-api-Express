import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";
import { FavoriteVideoTagTransactionInsertEntity } from "../../internaldata/favoritevideotagtransaction/entity/FavoriteVideoTagTransactionInsertEntity";
import { FavoriteVideoTagTransactionRepositorys } from "../../internaldata/favoritevideotagtransaction/repository/FavoriteVideoTagTransactionRepositorys";
import { FavoriteVideoTagTransactionRepositoryInterface } from "../../internaldata/favoritevideotagtransaction/repository/interface/FavoriteVideoTagTransactionRepositoryInterface";
import { TagMasterInsertEntity } from "../../internaldata/tagmaster/entity/TagMasterInsertEntity";
import { TagNameModel } from "../../internaldata/tagmaster/properties/TagNameModel";
import { TagMasterRepositorys } from "../../internaldata/tagmaster/repository/TagMasterRepositorys";
import { TagMasterRepositoryInterface } from "../../internaldata/tagmaster/repository/interface/TagMasterRepositoryInterface";
import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoTagFavoriteVideoSelectEntity } from "../entity/UpdateFavoriteVideoTagFavoriteVideoSelectEntity";
import { UpdateFavoriteVideoTagRequestModel } from "../model/UpdateFavoriteVideoTagRequestModel";
import { UpdateFavoriteVideoTagRepositorys } from "../repository/UpdateFavoriteVideoTagRepositorys";
import { UpdateFavoriteVideoTagRepositoryInterface } from "../repository/interface/UpdateFavoriteVideoTagRepositoryInterface";
import { UpdateFavoriteVideoTagModel } from "../type/UpdateFavoriteVideoTagModel";
import { UpdateFavoriteVideoTagResponseDataType } from "../type/UpdateFavoriteVideoTagResponseDataType";


export class UpdateFavoriteVideoTagService {

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
            const tagList = await getUpdateFavoriteVideoTagRepository.selectTagMaster(tagNameModel, userIdModel);

            // タグマスタに登録済み
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


    /**
     * 未使用のタグをマスタから削除
     * @param favoriteVideoTagRepository 
     * @param updateFavoriteVideoTagRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async deleteTagMaster(getUpdateFavoriteVideoTagRepository: UpdateFavoriteVideoTagRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await getUpdateFavoriteVideoTagRepository.deleteTagMaster(
            frontUserIdModel,
            tx);
    }
}