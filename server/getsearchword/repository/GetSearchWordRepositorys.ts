import { RepositoryType } from "../../constant/CommonConst";
import { GetSearchWordRepositoryPostgres } from "./concrete/GetSearchWordRepositoryPostgres";
import { GetSearchWordRepositoryInterface } from "./interface/GetSearchWordInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class GetSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, GetSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}