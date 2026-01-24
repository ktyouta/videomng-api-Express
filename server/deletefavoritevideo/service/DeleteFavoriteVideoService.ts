import { Prisma } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { BlockCommentTransactionRepositorys } from "../../internaldata/blockcommenttransaction/repository/BlockCommentTransactionRepositorys";
import { BlockCommentTransactionRepositoryInterface } from "../../internaldata/blockcommenttransaction/repository/interface/BlockCommentTransactionRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FavoriteCommentTransactionRepositorys } from "../../internaldata/favoritecommenttransaction/repository/FavoriteCommentTransactionRepositorys";
import { FavoriteCommentTransactionRepositoryInterface } from "../../internaldata/favoritecommenttransaction/repository/interface/FavoriteCommentTransactionRepositoryInterface";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoTagTransactionRepositorys } from "../../internaldata/favoritevideotagtransaction/repository/FavoriteVideoTagTransactionRepositorys";
import { FavoriteVideoTagTransactionRepositoryInterface } from "../../internaldata/favoritevideotagtransaction/repository/interface/FavoriteVideoTagTransactionRepositoryInterface";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { TagMasterRepositoryInterface } from "../../internaldata/tagmaster/repository/interface/TagMasterRepositoryInterface";
import { TagMasterRepositorys } from "../../internaldata/tagmaster/repository/TagMasterRepositorys";
import { DeleteFavoriteVideoFolderEntity } from "../entity/DeleteFavoriteVideoFolderEntity";
import { DeleteFavoriteVideoInterface } from "../repository/interface/DeleteFavoriteVideoInterface";


export class DeleteFavoriteVideoService {

    constructor(private readonly deleteFavoriteVideoInterface: DeleteFavoriteVideoInterface) { }

    /**
     * お気に入り動画の永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoRepository(): FavoriteVideoTransactionRepositoryInterface {
        return (new FavoriteVideoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画コメントの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoMemoRepository(): FavoriteVideoMemoTransactionRepositoryInterface {
        return (new FavoriteVideoMemoTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getFavoriteCommentRepository(): FavoriteCommentTransactionRepositoryInterface {
        return (new FavoriteCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画メモの永続ロジックを取得
     * @returns 
     */
    public getBlockCommentRepository(): BlockCommentTransactionRepositoryInterface {
        return (new BlockCommentTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画タグの永続ロジックを取得
     * @returns 
     */
    public getFavoriteVideoTagRepository(): FavoriteVideoTagTransactionRepositoryInterface {
        return (new FavoriteVideoTagTransactionRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
      * タグマスタの永続ロジックを取得
      * @returns 
      */
    public getTagMasterRepository(): TagMasterRepositoryInterface {
        return (new TagMasterRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画を削除する
     * @param favoriteVideoRepository 
     * @param deleteFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     * @param tx 
     */
    public async deleteVideo(favoriteVideoRepository: FavoriteVideoTransactionRepositoryInterface,
        videoId: VideoIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのお気に入り動画を削除する
        await favoriteVideoRepository.delete(
            frontUserIdModel,
            videoId,
            tx);
    }

    /**
     * メモを削除
     * @param favoriteVideoRepository 
     * @param deleteFavoriteVideoRequestModel 
     * @param frontUserIdModel 
     */
    public async deleteMemo(favoriteVideoMemoRepository: FavoriteVideoMemoTransactionRepositoryInterface,
        videoId: VideoIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient) {

        // 対象ユーザーのコメントを全て削除する
        await favoriteVideoMemoRepository.deleteUserMemo(
            frontUserIdModel,
            videoId,
            tx);
    }

    /**
     * お気に入り動画フォルダを削除
     * @param frontUserIdModel 
     * @param videoIdModel 
     * @param tx 
     * @returns 
     */
    async deleteFavoriteVideoFolder(videoIdModel: VideoIdModel,
        frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient
    ) {

        const entity = new DeleteFavoriteVideoFolderEntity(videoIdModel, frontUserIdModel);

        // 削除
        const result = await this.deleteFavoriteVideoInterface.deleteFavoriteVideoFolder(entity, tx);

        return result;
    }

    /**
     * 未使用のタグをマスタから削除
     * @param frontUserIdModel 
     * @param videoIdModel 
     * @param tx 
     * @returns 
     */
    async deleteTagMaster(frontUserIdModel: FrontUserIdModel,
        tx: Prisma.TransactionClient
    ) {
        // 削除
        await this.deleteFavoriteVideoInterface.deleteTagMaster(
            frontUserIdModel,
            tx);
    }
}