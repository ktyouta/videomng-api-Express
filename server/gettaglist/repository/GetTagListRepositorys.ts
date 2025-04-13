import { RepositoryType } from "../../util/const/CommonConst";
import { GetTagListRepositoryPostgres } from "./concrete/GetTagListRepositoryPostgres";
import { GetTagListRepositoryInterface } from "./interface/GetTagListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetTagListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetTagListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetTagListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetTagListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetTagListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}