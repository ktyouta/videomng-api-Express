import { RepositoryType } from "../../constant/CommonConst";
import { GetFrequentSearchWordRepositoryPostgres } from "./concrete/GetFrequentSearchWordRepositoryPostgres";
import { GetFrequentSearchWordRepositoryInterface } from "./interface/GetFrequentSearchWordInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class GetFrequentSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFrequentSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFrequentSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFrequentSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): GetFrequentSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
