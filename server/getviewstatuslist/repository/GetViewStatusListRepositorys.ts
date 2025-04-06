import { RepositoryType } from "../../util/const/CommonConst";
import { GetViewStatusListRepositoryPostgres } from "./concrete/GetViewStatusListRepositoryPostgres";
import { GetViewStatusListRepositoryInterface } from "./interface/GetViewStatusListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetViewStatusListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetViewStatusListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetViewStatusListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetViewStatusListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetViewStatusListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}