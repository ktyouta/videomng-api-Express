import { FavoriteCommentTransaction } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { YouTubeDataApiCommentDetailEndPointModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailEndPointModel";
import { YouTubeDataApiCommentDetailModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailModel";
import { YouTubeDataApiCommentDetailCommentIdList } from "../../external/youtubedataapi/videocommentdetail/properties/YouTubeDataApiCommentDetailCommentIdList";
import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { GetFavoriteCommentListSelectEntity } from "../entity/GetFavoriteCommentListSelectEntity";
import { GetFavoriteCommentListRepositorys } from "../repository/GetFavoriteCommentListRepositorys";
import { GetFavoriteCommentListRepositoryInterface } from "../repository/interface/GetFavoriteCommentListRepositoryInterface";


export class GetFavoriteCommentListService {

    /**
         * 永続ロジック用オブジェクトを取得
         */
    private getGetFavoriteCommentListRepository(): GetFavoriteCommentListRepositoryInterface {
        return (new GetFavoriteCommentListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入りコメント取得
     * @param userNameModel 
     */
    public async getFavoriteCommentList(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel,): Promise<FavoriteCommentTransaction[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteCommentListRepository = this.getGetFavoriteCommentListRepository();

        // お気に入りコメント取得用Entity
        const getFavoriteCommentListSelectEntity = new GetFavoriteCommentListSelectEntity(frontUserIdModel, videoIdModel);

        // お気に入りコメント取得
        const favoriteCommentList = await getGetFavoriteCommentListRepository.select(getFavoriteCommentListSelectEntity);

        return favoriteCommentList;
    }


    /**
     * お気に入りコメントリストからYouTube Data Apiの動画コメント情報を取得する
     * @param favoriteVideoList 
     * @returns 
     */
    public async getYouTubeVideoCommentList(favoriteCommentList: FavoriteCommentTransaction[]) {

        const youTubeDataApiCommentDetailCommentIdList = new YouTubeDataApiCommentDetailCommentIdList();

        favoriteCommentList.forEach((e: FavoriteCommentTransaction) => {
            youTubeDataApiCommentDetailCommentIdList.add(new CommentIdModel(e.commentId));
        });

        // エンドポイント
        const youTubeDataApiCommentDetailEndPointModel = new YouTubeDataApiCommentDetailEndPointModel(
            youTubeDataApiCommentDetailCommentIdList
        );

        // YouTube Data Apiから動画コメント詳細を取得
        const youTubeDataApiCommentDetailModel =
            await YouTubeDataApiCommentDetailModel.call(youTubeDataApiCommentDetailEndPointModel);

        return youTubeDataApiCommentDetailModel;
    }

}