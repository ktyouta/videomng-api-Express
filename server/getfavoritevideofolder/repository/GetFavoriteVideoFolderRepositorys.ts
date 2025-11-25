import { RepositoryType } from "../../util/const/CommonConst";
import { GetFavoriteVideoFolderRepositoryPostgres } from "./concrete/GetFavoriteVideoFolderRepositoryPostgres";
import { GetFavoriteVideoFolderRepositoryInterface } from "./interface/GetFavoriteVideoFolderRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositorysに追加する
 */
export class GetFavoriteVideoFolderRepositorys {


    private readonly repositorys: Record<RepositoryType, GetFavoriteVideoFolderRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, GetFavoriteVideoFolderRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new GetFavoriteVideoFolderRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): GetFavoriteVideoFolderRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}