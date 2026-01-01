import { BlockCommentTransaction } from '@prisma/client';
import { RepositoryType } from '../../common/const/CommonConst';
import { YouTubeDataApiCommentThreadEndPointModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadEndPointModel';
import { YouTubeDataApiCommentThreadModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel';
import { YouTubeDataApiCommentThreadMaxResult } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadMaxResult';
import { YouTubeDataApiCommentThreadNextPageToken } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadNextPageToken';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { GetFavoriteVideoBlockCommentSelectEntity } from '../entity/GetFavoriteVideoBlockCommentSelectEntity';
import { GetFavoriteVideoFavoriteCommentSelectEntity } from '../entity/GetFavoriteVideoFavoriteCommentSelectEntity';
import { GetFavoriteVideoCommentRepositorys } from '../repository/GetFavoriteVideoCommentRepositorys';
import { GetFavoriteVideoCommentRepositoryInterface } from '../repository/interface/GetFavoriteVideoCommentRepositoryInterface';


export class GetFavoriteVideoCommentService {

    /**
     * YouTube Data Apiを呼び出す
     * @param keyword 
     */
    public async callYouTubeDataCommentApi(videoIdModel: VideoIdModel,
        nextPageTokenModel: YouTubeDataApiCommentThreadNextPageToken
    ) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiCommentThreadEndPointModel = new YouTubeDataApiCommentThreadEndPointModel(
                videoIdModel,
                new YouTubeDataApiCommentThreadMaxResult(),
                nextPageTokenModel,
            );

            // YouTube Data Apiデータ取得
            const youTubeDataApiCommentThreadModel = await YouTubeDataApiCommentThreadModel.call(youTubeDataApiCommentThreadEndPointModel);

            return youTubeDataApiCommentThreadModel;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.VIDEO_COMMENT_ID} id:${videoIdModel}`);
        }
    }


    /**
     * 永続ロジック用オブジェクトを取得
     * @returns 
     */
    public getGetFavoriteVideoCommentRepository() {
        return (new GetFavoriteVideoCommentRepositorys()).get(RepositoryType.POSTGRESQL);
    }

    /**
     * お気に入り動画ブロックコメント取得
     * @param frontUserIdModel 
     * @returns 
     */
    public async getBlockComment(getFavoriteVideoCommentRepository: GetFavoriteVideoCommentRepositoryInterface,
        frontUserIdModel: FrontUserIdModel): Promise<BlockCommentTransaction[]> {

        // お気に入り動画ブロックコメント取得用Entity
        const getFavoriteVideoBlockCommentSelectEntity = new GetFavoriteVideoBlockCommentSelectEntity(frontUserIdModel);

        // お気に入り動画ブロックコメント取得
        const blockComment = await getFavoriteVideoCommentRepository.selectBlockComment(getFavoriteVideoBlockCommentSelectEntity);

        return blockComment;
    }


    /**
     * お気に入りコメント取得
     * @param frontUserIdModel 
     * @returns 
     */
    public async getFavoriteComment(getFavoriteVideoCommentRepository: GetFavoriteVideoCommentRepositoryInterface,
        frontUserIdModel: FrontUserIdModel): Promise<BlockCommentTransaction[]> {

        // お気に入りコメント取得用Entity
        const getFavoriteVideoFavoriteCommentSelectEntity = new GetFavoriteVideoFavoriteCommentSelectEntity(frontUserIdModel);

        // お気に入りコメント取得
        const favoriteComment = await getFavoriteVideoCommentRepository.selectFavoriteComment(getFavoriteVideoFavoriteCommentSelectEntity);

        return favoriteComment;
    }
}