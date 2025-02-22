import { FrontUserLoginMaster } from "@prisma/client";
import { JsonFileData } from "../../../util/service/JsonFileData";
import { JsonWebTokenUserInfoSelectEntity } from "../../entity/JsonWebTokenUserInfoSelectEntity";
import { JsonWebTokenUserInfoRepositoryInterface } from "../interface/JsonWebTokenUserInfoRepositoryInterface";
import { PrismaClientInstance } from "../../../util/service/PrismaClientInstance";



/**
 * json形式の永続ロジック用クラス
 */
export class JsonWebTokenUserInfoRepositoryJson implements JsonWebTokenUserInfoRepositoryInterface {


    constructor() {

    }


    /**
     * ユーザー取得
     * @returns 
     */
    async select(JsonWebTokenUserInfoSelectEntity: JsonWebTokenUserInfoSelectEntity):
        Promise<FrontUserLoginMaster | null> {

        const userId = JsonWebTokenUserInfoSelectEntity.frontUserId;
        const password = JsonWebTokenUserInfoSelectEntity.frontUserPassword;

        // ユーザー情報を取得
        const frontUserLoginInfo = await PrismaClientInstance.getInstance().frontUserLoginMaster.findUnique({
            where: {
                userId,
                password
            },
        });

        return frontUserLoginInfo;
    }

}