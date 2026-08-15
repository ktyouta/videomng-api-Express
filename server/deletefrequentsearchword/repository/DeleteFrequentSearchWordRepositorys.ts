import { RepositoryType } from "../../constant/CommonConst";
import { DeleteFrequentSearchWordRepositoryPostgres } from "./concrete/DeleteFrequentSearchWordRepositoryPostgres";
import { DeleteFrequentSearchWordRepositoryInterface } from "./interface/DeleteFrequentSearchWordRepositoryInterface";


/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class DeleteFrequentSearchWordRepositorys {


    private readonly repositorys: Record<RepositoryType, DeleteFrequentSearchWordRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, DeleteFrequentSearchWordRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new DeleteFrequentSearchWordRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType
     * @returns
     */
    public get(repositoryType: RepositoryType): DeleteFrequentSearchWordRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}
