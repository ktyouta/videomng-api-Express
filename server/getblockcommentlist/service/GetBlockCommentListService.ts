import { BlockCommentTransaction } from "@prisma/client";
import { RepositoryType } from "../../common/const/CommonConst";
import { YouTubeDataApiCommentDetailEndPointModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailEndPointModel";
import { YouTubeDataApiCommentDetailModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailModel";
import { YouTubeDataApiCommentDetailCommentIdList } from "../../external/youtubedataapi/videocommentdetail/properties/YouTubeDataApiCommentDetailCommentIdList";
import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { GetBlockCommentListSelectEntity } from "../entity/GetBlockCommentListSelectEntity";
import { GetBlockCommentListRepositorys } from "../repository/GetBlockCommentListRepositorys";
import { GetBlockCommentListRepositoryInterface } from "../repository/interface/GetBlockCommentListRepositoryInterface";


export class GetBlockCommentListService {

    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetBlockCommentListRepository(): GetBlockCommentListRepositoryInterface {
        return (new GetBlockCommentListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * ブロックコメント取得
     * @param userNameModel 
     */
    public async getBlockCommentList(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel): Promise<BlockCommentTransaction[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetBlockCommentListRepository = this.getGetBlockCommentListRepository();

        // ブロックコメント取得用Entity
        const getBlockCommentListSelectEntity = new GetBlockCommentListSelectEntity(frontUserIdModel, videoIdModel);

        // ブロックコメント取得
        const blockCommentList = await getGetBlockCommentListRepository.select(getBlockCommentListSelectEntity);

        return blockCommentList;
    }


    /**
     * ブロックコメントリストからYouTube Data Apiの動画コメント情報を取得する
     * @param favoriteVideoList 
     * @returns 
     */
    public async getYouTubeVideoCommentList(blockCommentList: BlockCommentTransaction[]) {

        const youTubeDataApiCommentDetailCommentIdList = new YouTubeDataApiCommentDetailCommentIdList();

        blockCommentList.forEach((e: BlockCommentTransaction) => {
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