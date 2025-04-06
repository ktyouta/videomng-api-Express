import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import ENV from '../../env.json';
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { GetViewStatusListResponseModel } from "../model/GetViewStatusListResponseModel";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { GetViewStatusListRepositorys } from "../repository/GetViewStatusListRepositorys";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { GetViewStatusListRepositoryInterface } from "../repository/interface/GetViewStatusListRepositoryInterface";
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


export class GetViewStatusListService {


    /**
     * 永続ロジック用オブジェクトを取得
     */
    private getGetViewStatusListRepository(): GetViewStatusListRepositoryInterface {
        return (new GetViewStatusListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * 視聴状況リスト取得
     * @param userNameModel 
     */
    public async getViewStatusList(): Promise<ViewStatusMaster[]> {

        // 永続ロジック用オブジェクトを取得
        const getGetViewStatusListRepository = this.getGetViewStatusListRepository();

        // 視聴状況リスト取得
        const favoriteCommentList = await getGetViewStatusListRepository.select();

        return favoriteCommentList;
    }

}