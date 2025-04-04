import { RepositoryType } from "../../../util/const/CommonConst";
import { FavoriteVideoCategoryTransactionRepositoryPostgres } from "./concrete/FavoriteVideoCategoryTransactionRepositoryPostgres";
import { FavoriteVideoCategoryTransactionRepositoryInterface } from "./interface/FavoriteVideoCategoryTransactionRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FavoriteVideoCategoryTransactionRepositorys {


    private readonly repositorys: Record<RepositoryType, FavoriteVideoCategoryTransactionRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FavoriteVideoCategoryTransactionRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FavoriteVideoCategoryTransactionRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FavoriteVideoCategoryTransactionRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}