import { RepositoryType } from "../../../util/const/CommonConst";
import { FavoriteVideoCommentTransactionRepositoryPostgres } from "./concrete/FavoriteVideoTransactionRepositoryPostgres";
import { FavoriteVideoCommentTransactionRepositoryInterface } from "./interface/FavoriteVideoTransactionRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FavoriteVideoCommentTransactionRepositorys {


    private readonly repositorys: Record<RepositoryType, FavoriteVideoCommentTransactionRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FavoriteVideoCommentTransactionRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FavoriteVideoCommentTransactionRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FavoriteVideoCommentTransactionRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}