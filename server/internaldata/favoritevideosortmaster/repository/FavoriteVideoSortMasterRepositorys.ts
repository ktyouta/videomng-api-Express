import { RepositoryType } from "../../../util/const/CommonConst";
import { FavoriteVideoSortMasterRepositoryPostgres } from "./concrete/FavoriteVideoSortMasterRepositoryPostgres";
import { FavoriteVideoSortMasterRepositoryInterface } from "./interface/FavoriteVideoSortMasterRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class FavoriteVideoSortMasterRepositorys {


    private readonly repositorys: Record<RepositoryType, FavoriteVideoSortMasterRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, FavoriteVideoSortMasterRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new FavoriteVideoSortMasterRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): FavoriteVideoSortMasterRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}