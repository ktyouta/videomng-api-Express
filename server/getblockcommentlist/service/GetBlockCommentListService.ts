import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetBlockCommentListResponseModel } from "../model/GetBlockCommentListResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetBlockCommentListRepositorys } from "../repository/GetBlockCommentListRepositorys";
import { GetBlockCommentListSelectEntity } from "../entity/GetBlockCommentListSelectEntity";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetBlockCommentListRepositoryInterface } from "../repository/interface/GetBlockCommentListRepositoryInterface";
import { BlockCommentTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { YouTubeDataApiCommentDetailCommentIdList } from "../../external/youtubedataapi/videocommentdetail/properties/YouTubeDataApiCommentDetailCommentIdList";
import { YouTubeDataApiCommentDetailEndPointModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailEndPointModel";
import { YouTubeDataApiCommentDetailModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailModel";
import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";


export class GetBlockCommentListService {

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
            throw Error(`ブロックコメントリスト取得時の認証エラー ERROR:${err}`);
        }
    }

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