import { Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { FavoriteVideoMemoTransactionRepositorys } from "../../internaldata/favoritevideomemotransaction/repository/FavoriteVideoMemoTransactionRepositorys";
import { FavoriteVideoMemoTransactionRepositoryInterface } from "../../internaldata/favoritevideomemotransaction/repository/interface/FavoriteVideoMemoTransactionRepositoryInterface";
import { FavoriteVideoTransactionRepositorys } from "../../internaldata/favoritevideotransaction/repository/FavoriteVideoTransactionRepositorys";
import { FavoriteVideoTransactionRepositoryInterface } from "../../internaldata/favoritevideotransaction/repository/interface/FavoriteVideoTransactionRepositoryInterface";
import { RepositoryType } from "../../util/const/CommonConst";
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

        // 対象ユーザーのお気に入り動画を全て論理削除する
        await favoriteVideoRepository.softDelete(
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
        await favoriteVideoMemoRepository.softDeleteUserMemo(
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
}