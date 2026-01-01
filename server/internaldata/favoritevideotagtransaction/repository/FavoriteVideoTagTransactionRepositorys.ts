import { RepositoryType } from "../../../common/const/CommonConst";
import { FavoriteVideoTagTransactionRepositoryPostgres } from "./concrete/FavoriteVideoTagTransactionRepositoryPostgres";
import { FavoriteVideoTagTransactionRepositoryInterface } from "./interface/FavoriteVideoTagTransactionRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FavoriteVideoTagTransactionRepositorys {


    private readonly repositorys: Record<RepositoryType, FavoriteVideoTagTransactionRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FavoriteVideoTagTransactionRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FavoriteVideoTagTransactionRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FavoriteVideoTagTransactionRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}