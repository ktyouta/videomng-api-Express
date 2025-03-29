import { RepositoryType } from "../../util/const/CommonConst";
import { GetFavoriteCommentListRepositoryPostgres } from "./concrete/GetFavoriteCommentListRepositoryPostgres";
import { GetFavoriteCommentListRepositoryInterface } from "./interface/GetFavoriteCommentListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteCommentListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteCommentListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteCommentListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteCommentListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteCommentListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}