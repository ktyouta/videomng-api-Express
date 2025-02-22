import { RepositoryType } from "../../util/const/CommonConst";
import { JsonWebTokenUserInfoRepositoryJson } from "./concrete/JsonWebTokenUserInfoRepositoryJson";
import { JsonWebTokenUserInfoRepositoryInterface } from "./interface/JsonWebTokenUserInfoRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class JsonWebTokenUserInfoRepositorys {


    private readonly repositorys: Record<RepositoryType, JsonWebTokenUserInfoRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, JsonWebTokenUserInfoRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new JsonWebTokenUserInfoRepositoryJson())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): JsonWebTokenUserInfoRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}