import { RepositoryType } from "../../common/const/CommonConst";
import { GetFavoriteVideoCustomRepositoryPostgres } from "./concrete/GetFavoriteVideoCustomRepositoryPostgres";
import { GetFavoriteVideoCustomRepositoryInterface } from "./interface/GetFavoriteVideoCustomRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteVideoCustomRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoCustomRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoCustomRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoCustomRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoCustomRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}