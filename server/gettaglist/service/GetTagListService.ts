import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserNameModel } from "../../internaldata/frontuserinfomaster/properties/FrontUserNameModel";
import { FLG, RepositoryType } from "../../util/const/CommonConst";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { FrontUserLoginMasterInsertEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterInsertEntity";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserLoginMasterRepositorys } from "../../internaldata/frontuserloginmaster/repository/FrontUserLoginMasterRepositorys";
import { FrontUserInfoMasterRepositorys } from "../../internaldata/frontuserinfomaster/repository/FrontUserInfoMasterRepositorys";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { JsonWebTokenUserModel } from "../../jsonwebtoken/model/JsonWebTokenUserModel";
import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { Request } from 'express';
import { CookieModel } from "../../cookie/model/CookieModel";
import { GetTagListRepositorys } from "../repository/GetTagListRepositorys";
import { GetTagListRepositoryInterface } from "../repository/interface/GetTagListRepositoryInterface";
import { GetTagListSelectEntity } from "../entity/GetTagListSelectEntity";


export class GetTagListService {

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
            throw Error(`タグ取得時の認証エラー ERROR:${err}`);
        }
    }

    /**
     * 永続ロジック用オブジェクトを取得
     */
    public getGetTagListRepository(): GetTagListRepositoryInterface {
        return (new GetTagListRepositorys()).get(RepositoryType.POSTGRESQL);
    }


    /**
     * タグ取得
     */
    public async getTagList(getGetTagListRepository: GetTagListRepositoryInterface,
        frontUserIdModel: FrontUserIdModel,) {

        // タグ取得用Entity
        const getTagListSelectEntity = new GetTagListSelectEntity(frontUserIdModel);

        // タグ取得
        const tagList = await getGetTagListRepository.selectTag(getTagListSelectEntity);

        return tagList;
    }
}