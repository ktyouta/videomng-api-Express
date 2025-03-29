import { FrontUserIdModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import ENV from '../../env.json';
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteCommentListResponseModel } from "../model/GetFavoriteCommentListResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetFavoriteCommentListRepositorys } from "../repository/GetFavoriteCommentListRepositorys";
import { GetFavoriteCommentListSelectEntity } from "../entity/GetFavoriteCommentListSelectEntity";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteCommentListRepositoryInterface } from "../repository/interface/GetFavoriteCommentListRepositoryInterface";
import { FavoriteCommentTransaction, FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/favoritevideotransaction/properties/VideoIdModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { YouTubeDataApiCommentDetailCommentIdList } from "../../external/youtubedataapi/videocommentdetail/properties/YouTubeDataApiCommentDetailCommentIdList";
import { YouTubeDataApiCommentDetailEndPointModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailEndPointModel";
import { YouTubeDataApiCommentDetailModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailModel";
import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";


export class GetFavoriteCommentListService {

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
            throw Error(`お気に入りコメントリスト取得時の認証エラー ERROR:${err}`);
        }
    }

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
    public async getFavoriteCommentList(frontUserIdModel: FrontUserIdModel): Promise<FavoriteCommentTransaction[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteCommentListRepository = this.getGetFavoriteCommentListRepository();

        // お気に入りコメント取得用Entity
        const getFavoriteCommentListSelectEntity = new GetFavoriteCommentListSelectEntity(frontUserIdModel);

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