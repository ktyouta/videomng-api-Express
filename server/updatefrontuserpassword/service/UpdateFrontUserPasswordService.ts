import { FrontUserLoginMaster, Prisma } from "@prisma/client";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserLoginMasterUpdateEntity } from "../../internaldata/frontuserloginmaster/entity/FrontUserLoginMasterUpdateEntity";
import { FrontUserPasswordModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserPasswordModel";
import { FrontUserSaltValueModel } from "../../internaldata/frontuserloginmaster/properties/FrontUserSaltValueModel";
import { NewJsonWebTokenModel } from "../../jsonwebtoken/model/NewJsonWebTokenModel";
import { PepperModel } from "../../pepper/model/PepperModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { UpdateFrontUserPasswordSelectEntity } from "../entity/UpdateFrontUserPasswordSelectEntity";
import { UpdateFrontUserPasswordRequestType } from "../model/UpdateFrontUserPasswordRequestType";
import { UpdateFrontUserPasswordRepositoryInterface } from "../repository/interface/UpdateFrontUserPasswordRepositoryPostgres";


export class UpdateFrontUserPasswordService {

    constructor(private readonly repository: UpdateFrontUserPasswordRepositoryInterface) { }

    /**
     * ユーザー情報取得
     * @param userNameModel 
     */
    public async getUserInfo(userIdModel: FrontUserIdModel,): Promise<FrontUserLoginMaster[]> {

        // ユーザー情報取得用Entity
        const entity = new UpdateFrontUserPasswordSelectEntity(userIdModel);

        // ユーザー情報を取得
        const userInfoList = await this.repository.select(entity);

        return userInfoList;
    }

    /**
     * jwtを作成する
     * @param userIdModel 
     * @param frontUserInfoCreateRequestBody 
     * @returns 
     */
    public createJsonWebToken(userIdModel: FrontUserIdModel) {

        try {
            const newJsonWebTokenModel = new NewJsonWebTokenModel(userIdModel);

            return newJsonWebTokenModel;
        } catch (err) {
            throw Error(`${err} endpoint:${ApiEndopoint.FRONT_USER_PASSWORD_ID}`);
        }
    }

    /**
     * パスワードを更新する
     * @param userIdModel 
     * @param frontUserInfoCreateRequestBody 
     * @returns 
     */
    async update(requestBody: UpdateFrontUserPasswordRequestType,
        userIdModel: FrontUserIdModel,
        pepperModel: PepperModel,
        tx: Prisma.TransactionClient,
    ) {

        // ソルト生成
        const newSaltModel = FrontUserSaltValueModel.generate();
        // 新パスワード
        const newPasswordModel = FrontUserPasswordModel.secureHash(requestBody.newPassword, newSaltModel, pepperModel);

        const entity = new FrontUserLoginMasterUpdateEntity(
            userIdModel,
            newPasswordModel,
            newSaltModel
        );

        const result = await this.repository.update(entity, tx);

        return result;
    }
}