import { RepositoryType } from "../../common/const/CommonConst";
import { GetFavoriteVideoCommentRepositoryPostgres } from "./concrete/GetFavoriteVideoCommentRepositoryPostgres";
import { GetFavoriteVideoCommentRepositoryInterface } from "./interface/GetFavoriteVideoCommentRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteVideoCommentRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoCommentRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoCommentRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoCommentRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoCommentRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}