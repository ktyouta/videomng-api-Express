import { RepositoryType } from "../../util/const/CommonConst";
import { GetFavoriteVideoSortListRepositoryPostgres } from "./concrete/GetFavoriteVideoSortListRepositoryPostgres";
import { GetFavoriteVideoSortListRepositoryInterface } from "./interface/GetFavoriteVideoSortListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteVideoSortListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoSortListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoSortListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoSortListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoSortListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}