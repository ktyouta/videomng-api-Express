import { FrontUserIdModel } from "../../../internaldata/common/properties/FrontUserIdModel";
import { PrismaClientInstance } from "../../../util/PrismaClientInstance";
import { CreateFavoriteSearchWordEntity } from "../../entity/CreateFavoriteSearchWordEntity";
import { FavoriteSearchWordType } from "../../types/FavoriteSearchWordType";
import { CreateFavoriteSearchWordRepositoryInterface } from "../interface/CreateFavoriteSearchWordInterface";


/**
 * お気に入りワードの永続ロジック用クラス（PostgreSQL）
 */
export class CreateFavoriteSearchWordRepositoryPostgres implements CreateFavoriteSearchWordRepositoryInterface {

    constructor() {
    }

    /**
     * お気に入りワード取得
     * @param frontUserIdModel
     * @returns
     */
    async getFavoriteSearchWord(frontUserIdModel: FrontUserIdModel): Promise<FavoriteSearchWordType[]> {

        const userId = frontUserIdModel.frontUserId;

        return await PrismaClientInstance.getInstance().favoriteSearchWordTransaction.findMany({
            select: {
                id: true,
                word: true,
            },
            where: {
                userId,
            }
        });
    }

    /**
     * お気に入りワード登録
     * @param entity
     * @returns
     */
    async insert(entity: CreateFavoriteSearchWordEntity) {

        const userId = entity.frontUserId;
        const word = entity.favoriteSearchWord;

        return await PrismaClientInstance.getInstance().favoriteSearchWordTransaction.create({
            data: {
                userId,
                word,
                createDate: new Date(),
                updateDate: new Date(),
            },
        });
    }
}
