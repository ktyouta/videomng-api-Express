import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetFavoriteVideoSortListResponseModel } from "../model/GetFavoriteVideoSortListResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetFavoriteVideoSortListRepositorys } from "../repository/GetFavoriteVideoSortListRepositorys";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetFavoriteVideoSortListRepositoryInterface } from "../repository/interface/GetFavoriteVideoSortListRepositoryInterface";
import { ViewStatusMaster, FavoriteVideoTransaction } from "@prisma/client";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CookieModel } from "../../cookie/model/CookieModel";
import { Request } from 'express';
import { YouTubeDataApiVideoDetailEndPointModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailEndPointModel";
import { YouTubeDataApiVideoDetailModel } from "../../external/youtubedataapi/videodetail/model/YouTubeDataApiVideoDetailModel";
import { YouTubeDataApiCommentDetailCommentIdList } from "../../external/youtubedataapi/videocommentdetail/properties/YouTubeDataApiCommentDetailCommentIdList";
import { YouTubeDataApiCommentDetailEndPointModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailEndPointModel";
import { YouTubeDataApiCommentDetailModel } from "../../external/youtubedataapi/videocommentdetail/model/YouTubeDataApiCommentDetailModel";
import { CommentIdModel } from "../../internaldata/common/properties/CommentIdModel";


export class GetFavoriteVideoSortListService {


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
            throw Error(`お気に入り動画リスト取得時の認証エラー ERROR:${err}`);
        }
    }


    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetFavoriteVideoSortListRepository(): GetFavoriteVideoSortListRepositoryInterface {
        return (new GetFavoriteVideoSortListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * お気に入り動画ソートリスト取得
     * @param userNameModel 
     */
    public async getFavoriteVideoSortList(): Promise<ViewStatusMaster[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetFavoriteVideoSortListRepository = this.getGetFavoriteVideoSortListRepository();

        // お気に入り動画ソートリスト取得
        const favoriteCommentList = await getGetFavoriteVideoSortListRepository.select();

        return favoriteCommentList;
    }

}