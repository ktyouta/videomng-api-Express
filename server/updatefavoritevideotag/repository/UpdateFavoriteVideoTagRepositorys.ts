import { RepositoryType } from "../../util/const/CommonConst";
import { UpdateFavoriteVideoTagRepositoryPostgres } from "./concrete/UpdateFavoriteVideoTagRepositoryPostgres";
import { UpdateFavoriteVideoTagRepositoryInterface } from "./interface/UpdateFavoriteVideoTagRepositoryInterface";



/**
 * 永続ロジック用クラスの管理用
 * ロジックを追加する場合はコンストラクタ内でrepositoryに追加(push)する
 */
export class UpdateFavoriteVideoTagRepositorys {


    private readonly repositorys: Record<RepositoryType, UpdateFavoriteVideoTagRepositoryInterface>;

    constructor() {

        const repositorys: Record<RepositoryType, UpdateFavoriteVideoTagRepositoryInterface> = {
            [RepositoryType.POSTGRESQL]: (new UpdateFavoriteVideoTagRepositoryPostgres())
        }

        this.repositorys = repositorys;
    }


    /**
     * 永続ロジックを取得
     * @param repositoryType 
     * @returns 
     */
    public get(repositoryType: RepositoryType): UpdateFavoriteVideoTagRepositoryInterface {
        return this.repositorys[repositoryType];
    }
}