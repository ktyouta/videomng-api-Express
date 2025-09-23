import { RepositoryType } from "../../util/const/CommonConst";
import { GetFavoriteVideoListRepositoryPostgres } from "./concrete/DownloadFavoriteVideoListRepositoryPostgres";
import { GetFavoriteVideoListRepositoryInterface } from "./interface/DownloadFavoriteVideoListRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class DownloadFavoriteVideoListRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoListRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoListRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoListRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoListRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}