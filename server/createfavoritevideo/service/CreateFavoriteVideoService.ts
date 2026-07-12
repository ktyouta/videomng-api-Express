import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../constant/CommonConst";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { TagIdModel } from "../../internaldata/common/properties/TagIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FavoriteVideoTransactionInsertEntity } from "../../internaldata/favoritevideotransaction/entity/FavoriteVideoTransactionInsertEntity";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { FolderIdModel } from "../../internaldata/foldermaster/model/FolderIdModel";
import { InsertFavoriteVideoFolderEntity } from "../entity/InsertFavoriteVideoFolderEntity";
import { InsertFavoriteVideoTagEntity } from "../entity/InsertFavoriteVideoTagEntity";
import { SelectFolderEntity } from "../entity/SelectFolderEntity";
import { SelectTagMasterEntity } from "../entity/SelectTagMasterEntity";
import { CreateFavoriteVideoRequestModel } from "../model/CreateFavoriteVideoRequestModel";
import { CreateFavoriteVideoRepositoryInterface } from "../repository/interface/CreateFavoriteVideoRepositoryInterface";


export class CreateFavoriteVideoService {


    constructor(private readonly createFavoriteVideoRepositoryInterface: CreateFavoriteVideoRepositoryInterface) { }

    /**
     * お気に入り動画の永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoRepository(): FavoriteVideoTransactionRepositoryInterface {
        return (new FavoriteVideoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画に動画を追加する
     * @param favoriteVideoRepository 
     * @param createFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async insertFavoriteVideo(favoriteVideoRepository: FavoriteVideoTransactionRepositoryInterface,
        createFavoriteVideoRequestModel: CreateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        const favoriteVideoInsertEntity = await FavoriteVideoTransactionInsertEntity.create(
            frontUserIdModel,
            createFavoriteVideoRequestModel.videoIdModel);

        await favoriteVideoRepository.insert(favoriteVideoInsertEntity, tx);
    }

    /**
     * タグの存在チェック
     * @param tagList
     * @param frontUserIdModel
     * @returns 存在しないタグIDのリスト
     */
    public async checkTagListExists(tagList: TagIdModel[],
        frontUserIdModel: FrontUserIdModel): Promise<number[]> {

        const entity = new SelectTagMasterEntity(tagList, frontUserIdModel);

        const tagMasterList = await this.createFavoriteVideoRepositoryInterface.selectTagMaster(entity);

        const existTagIdSet = new Set(tagMasterList.map((e) => e.tagId));
        const missingTagIdList = entity.tagIdList.filter((tagId) => !existTagIdSet.has(tagId));

        return missingTagIdList;
    }

    /**
     * お気に入り動画タグを登録
     * @param requestBody
     * @param frontUserIdModel
     * @param tx
     */
    public async insertVideoTag(requestBody: CreateFavoriteVideoRequestModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        await Promise.all(requestBody.tagList.map(async (e) => {
            await this.createFavoriteVideoRepositoryInterface.insertVideoTag(
                new InsertFavoriteVideoTagEntity(
                    frontUserIdModel,
                    requestBody.videoIdModel,
                    e,
                ), tx);
        }));
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

        const folderList = await this.createFavoriteVideoRepositoryInterface.selectFolder(entity);

        return folderList;
    }

    /**
     * お気に入り動画フォルダ登録
     * @param userNameModel 
     */
    async insertFavoriteVideoFolder(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,
        folderIdModel: FolderIdModel,
        tx: Prisma.TransactionClient) {

        const entity = new InsertFavoriteVideoFolderEntity(folderIdModel, videoIdModel, frontUserIdModel);

        // お気に入り動画フォルダ登録
        const data = await this.createFavoriteVideoRepositoryInterface.insertFavoriteFolder(entity, tx);

        return data;
    }
}